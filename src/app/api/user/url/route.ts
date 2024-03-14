import axios from "axios";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const PRESIGNED_URL =
  "https://s7echf6p73.execute-api.ap-southeast-1.amazonaws.com/create-presigned-url";

export async function POST() {
  try {
    const headersList = headers();
    const token = headersList.get("authorization");
    console.log('token', token)
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: PRESIGNED_URL,
      headers: {
        Authorization: token,
      },
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
}
