"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLayoutEffect, useMemo, useState } from "react";
import axios from "axios";
import { IconLogin } from "@/components/icons/login";
import { useAuthStore } from "./store/auth";
import isAuth from "@/components/isAuth";
import { Loading } from "@/components/icons/loading";
import Image from "next/image";
import bicycleImage from "../../public/bicycle-image.svg";

const Home = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = useMemo(() => searchParams.get("code"), []);
  const [isLoading, setIsLoading] = useState(false);

  const getTokenData = async () => {
    const data = {
      grant_type: "authorization_code",
      client_id: "css2ard64fmtopviba5m8pf1r",
      code: code,
      redirect_uri:
        "http://localhost:3000",
      scope: "openid",
    };
    let config = {
      url: "/api/token",
      method: "post",
      data,
    };
    setIsLoading(true);
    try {
      const response = await axios.request(config);
      if (response?.status === 200) {
        useAuthStore.setState({
          token: response.data,
        });
        router.push("/home");
      }
      setIsLoading(false);
      return null;
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };

  useLayoutEffect(() => {
    if (code) {
      getTokenData();
    }
  }, [code]);

  return (
    <>
      <main className="py-6">
        <div className="items-center justify-center grid grid-cols-2 gap-4">
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email*
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password*
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-rhinoThemeColorDark hover:text-rhinoThemeColorDark"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-rhinoThemeColorDark px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rhinoThemeColorDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rhinoThemeColorDark"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex items-center justify-center">
              <Link
                href="https://dev-project-x.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?response_type=code&client_id=css2ard64fmtopviba5m8pf1r&redirect_uri=http://localhost:3000&scope=openid&state"
                className="w-full px-3 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150 items-center justify-center"
              >
                <img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />
                <span className="text-lightBlue">{isLoading ? 'Signing....' : 'Sign In With Google'}</span>
              </Link>
            </div>
            </div>

          </div>
          {/*  */}
          <div>
            <Image
              className="w-full"
              src={bicycleImage}
              alt="Follow us on Twitter"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
