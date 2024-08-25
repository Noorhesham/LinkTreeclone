import DisplyLinks from "@/app/components/DisplyLinks";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import UserView from "@/app/components/UserView";
import connect from "@/app/lib/db";
import Link from "@/app/lib/models/linkModel";
import User from "@/app/lib/models/userModel";
import React from "react";
import "@/app/[locale]/fonts.css";
import { ButtonProvider } from "@/app/context/ButtonProvider";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { UserProps } from "@/app/constants";
import { WithContext, ProfilePage } from "schema-dts";

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
        canonical: `https://vega-nfc.vercel.app/${params.locale}/user-not-found`,
        languages: {
          en: `https://vega-nfc.vercel.app/en/${params.username}`,
          ar: `https://vega-nfc.vercel.app/ar/${params.username}`,
        },
      },
    };
  }

  return {
    title: `${user.firstName} ${user.lastName}`,
    description: `Explore the profile and links of ${user.firstName}. ${user.bio}`,
    alternates: {
      canonical: `https://vega-nfc.vercel.app/${params.locale}/${params.username}`,
      languages: {
        en: `https://vega-nfc.vercel.app/en/${params.username}`,
        ar: `https://vega-nfc.vercel.app/ar/${params.username}`,
      },
    },
    openGraph: {
      title: `${user.firstName} | Vega NFC`,
      description: `Discover the links and more about ${user.firstName}.`,
      url: `https://vega-nfc.vercel.app/${params.locale}/${params.username}`,
      type: "profile",
      images: [
        {
          url: user.photo,
          width: 1200,
          height: 630,
          alt: "Profile Picture of " + user.firstName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.firstName} | Vega NFC`,
      description: `Discover the links and more about ${user.firstName}.`,
      images: [user.photo],
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
      url: `https://vega-nfc.vercel.app/${params.locale}/${params.username}`,
    },
  };

  return (
    <ButtonProvider defaultBorder={user.buttons?.border} defaultColor={user.buttons?.color}>
      {/* Adding JSON-LD for structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        key="profile-jsonld"
      />
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
  );
};

export default Page;
