import Image from "next/image";
import Link from "next/link";

type ProfileLinkProps = {
  title: string;
  href?: string;
  imgUrl: string;
};
const ProfileLink = ({ title, imgUrl, href }: ProfileLinkProps) => {
  return (
    <div className=" flex-center gap-1">
      <Image src={imgUrl} alt="link icon" width={16} height={16} />
      {href ? (
        <Link href={href} target="_blank" className="text-accent-blue">
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
