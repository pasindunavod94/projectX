"use client";
import { useAuthStore } from "@/app/store/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state?.token?.access_token);
  const onBtnClick = () => {
    useAuthStore.setState({
      token: {
        token_type: "",
        access_token: "",
      },
    });
    router.push("/");
  };

  return (
    <header>
      <nav className="flex items-center bg-rhinoThemeColor shadow-lg h-20">
        <div className="w-full 2xl:container 2xl:mx-auto px-8">
          <div className="flex justify-between">
            <div className="logo flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="project-x Logo"
                width={40}
                height={40}
                priority
              />
              <h2 className="font-light text-2xl leading-6 text-black">
                Project X
              </h2>
            </div>
            {accessToken ? (
              <button
                onClick={onBtnClick}
                className="flex items-end justify-end ali"
              >
                log out
              </button>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
};
