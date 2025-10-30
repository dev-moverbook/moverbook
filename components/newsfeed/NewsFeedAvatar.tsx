import Image from "next/image"; // Import Next.js Image

interface UserAvatarProps {
  userImageUrl?: string | null;
  altText?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  userImageUrl,
  altText = "user",
}) => {
  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg`}
    >
      {userImageUrl ? (
        <Image
          src={userImageUrl}
          alt={altText}
          width={40}
          height={40}
          className="rounded-full"
        />
      ) : (
        <span>MR</span>
      )}
    </div>
  );
};

export default UserAvatar;
