// @ts-nocheck
import axios from "axios";
import { NextResponse } from "next/server";

const tokenUrl = 'https://dev-project-x.auth.ap-southeast-1.amazoncognito.com/oauth2/token';

export async function POST(req, _res) {
  try {
    const body = await req.json();
    console.log('body', body)
    let config = {
      method: "post",
      url: tokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          "XSRF-TOKEN=225ad24b-e6fd-442d-b150-412b58f42401; __Host-GAPS=1:KLfRIUPncH6Kp9XcZYAKQG6xgr8w0w:PGZ3wTKELIgMBeEE",
      },
      data: body,
    };
    const response = await axios.request(config);
    console.log('token Response', response)
    return NextResponse.json(response.data);
  } catch (error) {
    console.log('token error', error)
    return Response.json({ Message: "Failed", status: 500 });
  }
}
