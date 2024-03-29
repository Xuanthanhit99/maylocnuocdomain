import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../backend/config/db";
import Pusher from "pusher";
import Comment from "../../../models/CommentModel";
export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const reqBody = await request.json();
    const {
      name,
      image,
      phone,
      textcomment,
      replypeople,
      nameId,
      evaluate,
      nameproduct,
      isAdmin,
      isPurchase,
      createdAt,
    } = reqBody;

    console.log("createdAt", createdAt);

    const newComent = await new Comment({
      name,
      image,
      phone,
      textcomment,
      replypeople,
      nameId,
      evaluate,
      nameproduct,
      isAdmin,
      isPurchase,
    });

    await newComent.save();

    //     const pusher = await new Pusher({
    //   appId: process.env.PUSHER_APP_ID as string,
    //   key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
    //   secret: process.env.PUSHER_APP_SECRET as string,
    //   cluster: process.env.PUSHER_APP_CLUSTER as string,
    //   useTLS: true,
    // });

    // await pusher.trigger("chat", "hello", {
    //   message: `${JSON.stringify(reqBody)}`,
    // });

    return NextResponse.json({
      data: {
          name,
          image,
          phone,
          textcomment,
          replypeople,
          nameId,
          evaluate,
          nameproduct,
          isAdmin,
          createdAt,
      },
      success: true,
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({error,success: false,status: 500 });
}
};
