import { getTopInteractedTags } from "@/lib/actions/tag.actions";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import { Badge } from "../ui/badge";

interface UserCardProps {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  const interactedTags: any = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/prfile/${user.clerkId}`}
      className=" shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className=" background-light900_dark200 light-border flex-center w-full flex-col rounded-2xl border p-8">
        <Image
          src={user.picture}
          alt={user.name}
          width={100}
          height={100}
          className=" rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className=" h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>
        <div className=" mt-5 ">
          {interactedTags?.length > 0 ? (
            <div className=" flex items-center gap-2">
              {interactedTags.map((tag: string) => (
                <RenderTag key={tag} tag={tag} />
              ))}
            </div>
          ) : (
            <Badge>No Tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
