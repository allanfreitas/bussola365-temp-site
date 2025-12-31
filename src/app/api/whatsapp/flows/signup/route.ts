import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //   const searchParams = req.nextUrl.searchParams;
  //   const mode = searchParams.get("hub.mode");
  //   const token = searchParams.get("hub.verify_token");
  //   const challenge = searchParams.get("hub.challenge");

  //console.log(`Received webhook Validation: ${mode}, ${token}, ${challenge}`);

  return new NextResponse(JSON.stringify({ message: "My Flow" }), {
    status: 200,
  });
}
