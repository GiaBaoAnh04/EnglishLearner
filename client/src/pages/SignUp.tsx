import React, { useState } from "react";
import { authApi, RegisterData } from "../api/authApi"; // import API

interface FloatingLabelInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  type,
  value,
  setValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          if (!value) setIsFocused(false);
        }}
        className="text-dark100_light500 w-full border-b-2 bg-transparent p-2 pt-5 focus:outline-none"
        placeholder=" "
        required
      />
      <label
        htmlFor={id}
        className={`absolute left-2 transition-all duration-200 ${
          isFocused || value
            ? "text-dark100_light500 top-0 text-xs"
            : "text-dark100_light500 top-2 text-sm"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp!");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const payload: RegisterData = {
      email,
      password,
      username,
      fullName,
    };

    if (!username || username.length < 3) {
      setErrorMessage("Username phải có ít nhất 3 ký tự");
      return;
    }

    if (!fullName) {
      setErrorMessage("Full name không được để trống");
      return;
    }

    if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setErrorMessage("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      console.log(payload, "payload");

      const res = await authApi.register(payload);

      if (res.data.success) {
        setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
        setUsername("");
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setBirthday("");
        setGender("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(res.data.message || "Đăng ký thất bại!");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Lỗi kết nối server.");
    }
  };

  return (
    <div
      className="background-light800_dark400 flex h-screen w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/6f/12/bd/6f12bd3e987161047b6d78bf0bfb3081.jpg')",
      }}
    >
      <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-xl my-[110px] w-[549px] px-[55px] py-[30px] shadow-md">
        <h2 className="text-light-500 mb-6 text-center text-2xl font-bold">
          Sign Up
        </h2>

        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="mb-4 text-center text-green-500">
            {successMessage}
          </div>
        )}

        <form className="mt-[20px]" onSubmit={handleSubmit}>
          <FloatingLabelInput
            id="username"
            label="Username"
            type="text"
            value={username}
            setValue={setUsername}
          />
          <FloatingLabelInput
            id="fullName"
            label="Full Name"
            type="text"
            value={fullName}
            setValue={setFullName}
          />
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <FloatingLabelInput
            id="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            setValue={setPhoneNumber}
          />

          <div className="mb-6 flex justify-between">
            <div className="mr-2 w-full">
              <label
                htmlFor="birthday"
                className="text-dark100_light500 block text-sm font-medium"
              >
                Birthday
              </label>
              <input
                type="date"
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="text-dark100_light500 w-full border-b-2 bg-transparent p-2 focus:outline-none"
              />
            </div>
            <div className="ml-2 w-full">
              <label
                htmlFor="gender"
                className="text-dark100_light500 mb-2 block text-sm font-medium"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="text-light-500 w-full border-b-2 bg-transparent p-2 focus:outline-none"
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-6 flex justify-between">
            <div className="mr-2 w-full">
              <FloatingLabelInput
                id="password"
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
              />
            </div>
            <div className="ml-2 w-full">
              <FloatingLabelInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                setValue={setConfirmPassword}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-100 py-2 text-white transition duration-200 rounded-xl"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
