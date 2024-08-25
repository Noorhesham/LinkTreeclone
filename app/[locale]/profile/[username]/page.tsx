import DisplyLinks from "@/app/components/DisplyLinks";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import UserView from "@/app/components/UserView";
import connect from "@/app/lib/db";
import Link from "@/app/lib/models/linkModel";
import User from "@/app/lib/models/userModel";
import { Metadata } from "next";
import React from "react";
import { ButtonProvider } from "@/app/context/ButtonProvider";
import { notFound } from "next/navigation";
import { WithContext, ProfilePage } from "schema-dts";
import Head from "next/head";
import { UserProps } from "@/app/constants";

const getUserData = async (username: string) => {
  await connect();
  const user: UserProps | any = await User.findOne({ userName: username })
    .populate({ path: "links", model: Link })
    .lean();
  return user;
};

export const generateMetadata = async ({
  params,
}: {
  params: { username: string; locale: string };
}): Promise<Metadata> => {
  const user = await getUserData(params.username);

  if (!user) {
    return {
      title: "User not found",
      description: "The user you are looking for does not exist.",
      alternates: {
        canonical: `/${params.locale}/user-not-found`,
        languages: {
          en: `/en/profile/${params.username}`,
          ar: `/ar/profile/${params.username}`,
        },
      },
    };
  }

  const imageUrl = user.photo.startsWith("http") ? user.photo : `${user.photo}`;

  return {
    title: `${user.firstName} ${user.lastName}`,
    description: `Explore the profile and links of ${user.firstName}. ${user.bio}`,
    alternates: {
      canonical: `/${params.locale}/profile/${params.username}`,
      languages: {
        en: `/en/profile/${params.username}`,
        ar: `/ar/profile/${params.username}`,
      },
    },
    openGraph: {
      title: `${user.firstName} | Vega NFC`,
      description: `Discover the links and more about ${user.firstName}.`,
      url: `${params.locale}/profile/${params.username}`,
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Profile Picture of ${user.firstName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.firstName} | Vega NFC`,
      description: `Discover the links and more about ${user.firstName}.`,
      images: [imageUrl],
    },
  };
};

const Page = async ({ params }: { params: { username: string; locale: string } }) => {
  const user = await getUserData(params.username);

  if (!user) {
    return notFound();
  }

  // JSON-LD Structured Data
  const jsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: `${user.firstName} ${user.lastName}`,
      description: user.bio,
      image: user.photo,
      url: `/${params.locale}/${params.username}`,
    },
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="profile-jsonld"
        />
      </Head>
      <ButtonProvider defaultBorder={user.buttons?.border} defaultColor={user.buttons?.color}>
        <MaxWidthWrapper>
          <section className={`w-full min-h-screen ${user.font} pt-20 theme-${user.theme}`}>
            <div className="flex flex-col gap-5">
              <UserView user={user} />
              {user.links && user.links.length > 0 ? (
                <DisplyLinks
                  border={user.buttons?.border}
                  color={user.buttons?.color}
                  theme={user.theme}
                  links={user.links}
                />
              ) : (
                <div>No links available</div>
              )}
            </div>
          </section>
        </MaxWidthWrapper>
      </ButtonProvider>
    </>
  );
};

export default Page;
