// @ts-nocheck
"use client";
import React, { useState } from "react";
import xlx from "../../../public/xlx.svg";
import Image from "next/image";
import { useAuthStore } from "../../app/store/auth";

export const FileUploader = ({ handleFileUpload, getPresignedUrl }) => {
  const userValues = useAuthStore((state) => state.user);
  const [fileName, setFileName] = useState("");
  const onChangeFileInput = (e) => setFileName(e.target.files[0]?.name);

  const onChangeEmail = (e) =>
    useAuthStore.setState({
      user: { ...userValues, email: e.target?.value },
    });

  const onChangeName = (e) =>
    useAuthStore.setState({
      user: { ...userValues, name: e.target?.value },
    });

  return (
    <>
      <form onSubmit={handleFileUpload}>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <div className="grid grid-cols-4">
              <div className="flex items-center justify-center bg-gray-100 m-3 rounded-full py-2">
                <Image src={xlx} alt="Follow us on Twitter" />
              </div>

              <div className="flex items-center justify-center col-span-3">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col col-span-3 items-center justify-center w-full border-1 border-gray-400 rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-100"
                >
                  {fileName ? (
                    <p className="text-black">{fileName}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-rhinoThemeColorDark">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        XL or CSV
                      </p>
                    </div>
                  )}

                  <input
                    id="dropzone-file"
                    className="hidden"
                    type="file"
                    name="file"
                    onClick={getPresignedUrl}
                    onChange={onChangeFileInput}
                  />
                </label>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Senders Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={userValues?.name}
                onChange={onChangeName}
                className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Senders Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={userValues?.email}
                  onChange={onChangeEmail}
                  className="pl-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              className="focus:outline-none text-white bg-rhinoThemeColorDark hover:rhinoThemeColorDark focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-60"
              type="submit"
            >
              Generate
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
