"use client";

import { format } from "date-fns";
import { type NextPage } from "next";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

import NotFound from "~/pages/404";

import { AvatarGroup } from "~/components/ui/custom/avatar-group";
import { Input } from "~/components/ui/input";

import TeamDialog from "~/components/events/team";
import Loader from "~/components/loader";
import CopyBtn from "~/components/utils/copyBtn";
import { api } from "~/utils/api";

const EventsSlug: NextPage = () => {
  const router = useRouter();

  const { data: user } = api.user.getUser.useQuery();

  const id = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : router.query.slug;

  const path = usePathname();

  const url = `http://localhost:3000${path}`;

  const {
    data: event,
    isLoading,
    status,
  } = api.event.getEventById.useQuery({
    eventId: parseInt(id!),
  });

  if (isLoading || status === "pending")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );

  if (status === "error") return <NotFound />;

  return (
    <main className="container mb-1 mt-16 flex w-[100%] flex-col items-center justify-start space-y-4 font-sans">
      <section className="intro-card relative flex h-96 w-full flex-col overflow-hidden rounded-2xl border border-border bg-accent sm:flex-row">
        <div className="w-2/5">
          <div className="relative h-full w-full">
            <Image
              className="object-cover object-center"
              src={
                event.imgSrc && event.imgSrc.length > 0
                  ? event.imgSrc
                  : "/assets/images/eventFallback.png"
              }
              alt="event"
              fill
            />
          </div>
        </div>
        <div className="w-3/5 space-y-4 p-8">
          <p className="events-heading text-5xl  font-bold md:text-6xl">
            {event?.name}{" "}
          </p>

          <p className="text-base font-medium sm:text-lg">
            Date: {format(event.fromDate, "dd/MM/yyyy")}
          </p>

          <p className="text-base font-medium">Venue : {event.venue}</p>
          <p className="text-sm font-medium sm:text-base">
            Organisers :{" "}
            {event.Organiser?.map((organiser) => organiser.User.name).join(
              ", ",
            )}
          </p>

          <div className="mt-4 flex items-center gap-8">
            {!user?.memberSince && (
              <p className="text-lg font-bold">
                Entry fee: Rs
                {event.amount > 0 ? ` ${event.amount}/-` : " FREE"}{" "}
              </p>
            )}

            {user?.memberSince !== undefined && (
              <TeamDialog
                eventId={event.id}
                maxTeamSize={event.maxTeamSize}
                amount={event.amount}
                eventName={event.name}
              />
            )}
          </div>
        </div>
        <Image
          src="/card_bottom.png"
          alt=""
          height={50}
          width={50}
          className="absolute bottom-0 left-0 right-0 top-auto w-[100%] opacity-50"
        />
      </section>

      <section className="intro-card relative mx-auto flex  w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-accent p-8 sm:flex-row">
        <div className="space-y-4 " style={{ flex: 2 }}>
          <h1 className="text-3xl font-bold ">Description</h1>
          <p
            className="font-extralight"
            dangerouslySetInnerHTML={{ __html: event.description ?? "" }}
          />
        </div>
        <div className="b" style={{ flex: 1 }}>
          <h1 className="text-xl font-medium">
            {event.teamCount > 0
              ? `Registered (${event.teamCount})`
              : "Register Now!"}
          </h1>
          <AvatarGroup images={event.selectedImages} />
          <h1 className="mb-2 mt-8 text-xl font-medium">Share with a friend</h1>
          <div className="flex gap-2 ">
            <Input
              className="card-attributes flex-1 rounded-lg text-xs"
              type="text"
              value={url}
              disabled
            />
            <CopyBtn value={url} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventsSlug;
