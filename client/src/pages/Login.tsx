import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, LoginData } from "../api/authApi";
import { useUser } from "../context/userContext";

const FloatingLabelInput = ({
  id,
  label,
  type,
  value,
  setValue,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  setValue: (val: string) => void;
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
          if (value === "") setIsFocused(false);
        }}
        className="text-dark100_light500 w-full border-b-2 bg-transparent p-3 pt-5 rounded-[10px]"
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

const Login = () => {
  const [email, setEmail] = useState(""); // đổi từ username -> email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Lấy updateUser từ context

    try {
      const res = await authApi.login({ email, password } as LoginData);
      if (res.data.success) {
        const userData = res.data.data.user;

        // 1. Lưu token và user vào localStorage
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        // 2. Cập nhật state toàn cục bằng updateUser
        // Đây là bước quan trọng để thông báo cho context biết rằng user đã thay đổi
        updateUser(userData);

        navigate("/");
      } else {
        setError(res.data.message || "Đăng nhập thất bại.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi kết nối server.");
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/6f/12/bd/6f12bd3e987161047b6d78bf0bfb3081.jpg')",
      }}
    >
      <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm my-[110px] w-[549px] rounded-xl px-[55px] py-[51px] shadow-lg">
        <h2 className="text-light-500 mb-6 text-center text-2xl font-bold">
          Đăng Nhập
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        <form className="mt-[74px]" onSubmit={handleSubmit}>
          <FloatingLabelInput
            id="email"
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <FloatingLabelInput
            id="password"
            label="Mật khẩu"
            type="password"
            value={password}
            setValue={setPassword}
          />
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-primary-100 py-2 text-white transition duration-200"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-2 text-end">
          <a href="#" className="text-primary-100 text-sm hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-500">hoặc</span>
          <hr className="grow border-gray-300" />
        </div>

        <div className="mt-4 text-center">
          <p className="text-dark100_light500 text-sm">
            Chưa có tài khoản?{" "}
            <a href="/sign-up" className="text-primary-100 hover:underline">
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
