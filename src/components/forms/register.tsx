import { zodResolver } from "@hookform/resolvers/zod";
import { type inferProcedureOutput } from "@trpc/server";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { LuLogOut } from "react-icons/lu";
import { toast } from "sonner";
import { z } from "zod";

import { type AppRouter } from "~/server/api/root";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import PaymentButton from "~/components/razorPay/paymentButton";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { registerZ } from "~/zod/authZ";

import { InputOTP, InputOTPSlot } from "../ui/input-otp";

const RegisterForm: FunctionComponent<{
  className?: string;
}> = ({ className }) => {
  const { data: user } = api.user.getUser.useQuery();
  if (!user) return null;
  if (user.memberSince) return <AlreadyMember user={user} />;
  return <InnerRegisterForm className={className} user={user} />;
};

const AlreadyMember: FunctionComponent<{
  user: inferProcedureOutput<AppRouter["user"]["getUser"]>;
}> = ({ user }) => {
  const router = useRouter();
  return (
    <Card className="backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Already a Member</CardTitle>
      </CardHeader>
      <CardContent className="flex max-w-prose flex-col gap-3">
        <div>
          Thank you for showing interest in registering, but you seem to be a
          member already
        </div>
        <div>
          If you think this is an error, verify that you are signed in with the
          correct account.
        </div>
        <div>
          You are currently signed in as{" "}
          <span className="font-bold">{user.name}</span> (
          <span className="font-bold">{user.email}</span>).
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            router.back();
          }}
        >
          <LuLogOut className="mr-2 size-5" />
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};

const InnerRegisterForm: FunctionComponent<{
  user: inferProcedureOutput<AppRouter["user"]["getUser"]>;
  className?: string;
}> = ({ className, user }) => {
  const router = useRouter();

  const register = api.auth.register.useMutation();

  const formSchema = z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    branch: z.string(),
    year: z.string(),
    ...registerZ.shape,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      branch: user.Branch.name,
      year: user.year,
      reasonToJoin: "",
      expectations: "",
      contribution: "",
      paymentId:
        user.Payment?.paymentType === "MEMBERSHIP" ? user.Payment.id : "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.loading("Registering to FLC...");
    register.mutate(
      {
        reasonToJoin: values.reasonToJoin,
        expectations: values.expectations,
        contribution: values.contribution,
        paymentId: values.paymentId,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Registered to FLC successfully!");
          setTimeout(() => void router.push("/profile"), 1000);
        },
        onError: ({ message }) => {
          toast.dismiss();
          toast.error(message);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, "space-y-4")}
      >
        <FormMessage className="flex justify-center text-4xl text-white/90">
          Register
        </FormMessage>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Name"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white dark:text-white">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-[#494949]"
                  placeholder="Email"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex-1 rounded-lg">
              <FormLabel className="text-white dark:text-white">
                Phone
              </FormLabel>
              <FormControl>
                <InputOTP
                  className="bg-[#494949]"
                  maxLength={10}
                  {...field}
                  disabled
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="size-6 bg-[#494949] sm:size-10"
                    />
                  ))}
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white dark:text-white">
                  Branch
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#494949]"
                    placeholder="Branch"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white dark:text-white">
                  Graduation Year
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#494949]"
                    placeholder="Graduation Year"
                    {...field}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reasonToJoin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Why do you want to join FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                What are your expectations from FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                How would you contribute to FLC?
              </FormLabel>
              <FormControl>
                <Textarea
                  className="bg-[#494949]"
                  placeholder="Answer"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white dark:text-white">
                Membership Fees (₹400 + 2% razorpay fee)
              </FormLabel>
              <FormControl>
                {field.value ? (
                  <Input className="bg-[#494949]" disabled {...field} />
                ) : (
                  <PaymentButton
                    className="flex"
                    paymentType="MEMBERSHIP"
                    description="Club Membership"
                    onSuccess={(paymentId) =>
                      form.setValue("paymentId", paymentId)
                    }
                    onFailure={() => toast.error("Payment failed")}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            type="submit"
            asChild
          >
            <Link href="/profile">Not interested</Link>
          </Button>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            type="submit"
          >
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
