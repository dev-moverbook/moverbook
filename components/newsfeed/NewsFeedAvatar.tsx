"use client";

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
        <img
          src={userImageUrl}
          alt={altText}
          className="w-full h-full rounded-full"
        />
      ) : (
        <span>MR</span>
      )}
    </div>
  );
};

export default UserAvatar;
