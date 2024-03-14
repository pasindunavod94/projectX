// @ts-nocheck
import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const EMAIL_CONTENT_URL =
  "https://s7echf6p73.execute-api.ap-southeast-1.amazonaws.com/generate-email-content";

export async function POST(req) {
  try {
    const body = await req.json();
    const headersList = headers();
    const token = headersList.get("authorization");
    let config = {
      method: "post",
      url: EMAIL_CONTENT_URL,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      data: body,
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}
