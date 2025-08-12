import React, { useRef, useState, useEffect } from "react";

interface AvatarUploadProps {
  avatar: string;
  onFileSelect: (file: File) => void;
}

export default function AvatarUpload({
  avatar,
  onFileSelect,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(avatar);

  useEffect(() => {
    setPreview(avatar);
  }, [avatar]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // hiển thị preview ngay
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={preview}
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80 border"
        onClick={handleImageClick}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <p className="text-sm text-gray-500 mt-2">Nhấn vào ảnh để thay đổi</p>
    </div>
  );
}
