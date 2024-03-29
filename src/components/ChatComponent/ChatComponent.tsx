"use client";
import React, { useEffect, useRef, useState } from "react";
import SocketIOClient, { io } from "socket.io-client";
import Pusher from "pusher-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import CustomUpload from "../FormItemFloatLabel/CustomUpload";
import { Avatar, Button, Checkbox, Modal, Rate } from "antd";
import CustomInput from "../FormItemFloatLabel/CustomInput";
import moment from "moment";

interface IMsg {
  user: string;
  msg: string;
}

// create random user
const ChatComponent = ({ slugParam, onOpenNoti }: any) => {
  const [valueComment, setValueComment] = useState<any>([]);
  const [valueCommentImage, setValueCommentImage] = useState<any>("");
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [rateValue, setRateValue] = useState<any>(5);
  const [useValueName, setUseValueName] = useState<string>("");
  const [useValuePhone, setUseValuePhone] = useState<string>("");
  const [isPurchase, setIsPurchase] = useState<boolean>(false);
  const [isReply, setIsReply] = useState<any>();
  const [rateValueComment, setRateValueComment] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRef = useRef(null);
  // init chat and message
  const [msg, setMsg] = useState<string>("");

  const covertToBase64 = (e: any) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      // setImageValue(reader.result);
      setValueCommentImage(reader.result);
    };

    reader.onerror = (error) => {
      console.log("error", error);
    };
  };

  const sendMessage = async () => {
    const message = {
      name: useValueName,
      phone: useValuePhone,
      image: valueCommentImage || "",
      textcomment: msg,
      isPurchase: isPurchase,
      nameId: uuidv4(),
      isAdmin: false,
      nameproduct: slugParam,
      evaluate: rateValue,
      createdAt: Date.now(),
      replypeople: [],
    };

    // dispatch message to other users
    const resp = await axios.post("/api/pusher", message);
    onOpenNoti();
    if (resp?.data?.success) {
      const arrayApi = await [...valueComment, resp?.data?.data];
      setValueComment(arrayApi);
      setUseValueName("");
      setRateValueComment(0);
      setUseValuePhone("");
      setMsg("");
    }
    // focus after click
    // @ts-ignore
    inputRef?.current?.focus();
  };

  const sendMessageReply = async (slugParam: any) => {
    const apiGet = await axios.post("/api/pusher/getCommentByNameProduct", {
      nameproduct: slugParam,
    });
    setValueComment([...apiGet?.data?.data]);
  };

  useEffect(() => {
    sendMessageReply(slugParam);
  }, [slugParam]);

  const onClickReplyComment = async (value: any) => {
    const message = {
      name: value?.name,
      phone: value?.phone,
      image: value?.image || "",
      textcomment: value?.textcomment,
      isPurchase: value?.isPurchase,
      nameId: value?.nameId,
      isAdmin: value?.isAdmin,
      nameproduct: value?.nameproduct,
      evaluate: value?.evaluate,
      replypeople: [
        ...value?.replypeople,
        {
          nameComment: useValueName,
          phoneComment: useValuePhone,
          evaluateComment: rateValue,
          textComment: msg,
          createdAt: Date.now()
        },
      ],
    };

    // dispatch message to other users
    const resp = await fetch("/api/pusher/postReplyComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(message),
    });
    const repons = await resp.json();
    if (repons.success) {
      sendMessageReply(slugParam);
      setIsModalOpen(false);
    }
  };

  const showModal = (item:any, index: number) => {
    setIsModalOpen(true);
    setUseValueName("");
    setRateValueComment(0);
    setUseValuePhone("");
    setMsg("");
    setRateValue(5)
    setIsReply(item);
  };

  const onClickReply = () => {
    onClickReplyComment(isReply);
    setIsModalOpen(false);
    setUseValueName("");
    setUseValuePhone("");
    setRateValue(5)
    setRateValueComment(0);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log("valueComment", valueComment);
  return (
    <div className="flex justify-center bg-[#f3f3f3] relative">
      <div className="w-full">
        {/*Gửi bình luận */}
        <div>
          <div className="font-semibold h-14 flex items-center font-serif text-xl text-black ">
            Hỏi và đáp ({valueComment?.length} Bình luận)
          </div>
          <div className="border p-3 bg-white">
            <div className="">
              <textarea
                ref={inputRef}
                rows={5}
                cols={5}
                value={msg}
                placeholder={"Connecting..."}
                className="w-full h-full rounded border-[#9580ff] border-2 px-1 hover:border-[#8aff80] focus:border-[#80ffea] focus:outline-none"
                onChange={(e: any) => {
                  setMsg(e.target.value);
                }}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <CustomUpload label={"upload image"} onChange={covertToBase64} />
              <div>
                <div className="my-3">
                  <div className="mb-1">Đánh giá</div>{" "}
                  <Rate
                    tooltips={desc}
                    onChange={setRateValue}
                    value={rateValue}
                    allowClear={false}
                  />{" "}
                </div>
                <div className="flex w-full">
                  <div className="w-1/2 mr-4">
                    <CustomInput
                      label="Họ tên*"
                      name="username"
                      className="mb-2"
                      onChange={(e) => setUseValueName(e?.target?.value)}
                      value={useValueName}
                    />
                  </div>
                  <div className="w-1/2 ml-4">
                    <CustomInput
                      label="Số điện thoại*"
                      name="phone"
                      className="mb-2"
                      onChange={(e) => setUseValuePhone(e?.target?.value)}
                      value={useValuePhone}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Checkbox onChange={(e) => setIsPurchase(e.target.value)}>
                  Đã mua hàng tại cửa hàng
                </Checkbox>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-stretch my-2 w-2/12">
            <button
              className="bg-red-500 border-2 w-36 h-14 rounded-xl shadow text-sm text-white px-2 hover:bg-white hover:text-red-500 hover:border-red-500"
              onClick={() => sendMessage()}
            >
              Gửi bình luận
            </button>
          </div>
        </div>
        <div className="flex ">
          <div
            onClick={() => setRateValueComment(0)}
            className={` ${
              rateValueComment === 0
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            Tất cả
          </div>
          <div
            onClick={() => setRateValueComment(5)}
            className={` ${
              rateValueComment === 5
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            5 sao{" "}
            {`(${
              valueComment?.filter((item: any) => item?.evaluate === 5)?.length
            })`}
          </div>
          <div
            onClick={() => setRateValueComment(4)}
            className={` ${
              rateValueComment === 4
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            4 sao{" "}
            {`(${
              valueComment?.filter((item: any) => item?.evaluate === 4)?.length
            })`}
          </div>
          <div
            onClick={() => setRateValueComment(3)}
            className={` ${
              rateValueComment === 3
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            3 sao{" "}
            {`(${
              valueComment?.filter((item: any) => item?.evaluate === 3)?.length
            })`}
          </div>
          <div
            onClick={() => setRateValueComment(2)}
            className={` ${
              rateValueComment === 2
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            2 sao{" "}
            {`(${
              valueComment?.filter((item: any) => item?.evaluate === 2)?.length
            })`}
          </div>
          <div
            onClick={() => setRateValueComment(1)}
            className={` ${
              rateValueComment === 1
                ? "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                : "text-white bg-red-500 hover:bg-white hover:text-red-500"
            } mr-4 cursor-pointer h-9 rounded-lg flex justify-center items-center text-center text-sm  font-semibold w-24  border-2 border-red-500`}
          >
            1 sao{" "}
            {`(${
              valueComment?.filter((item: any) => item?.evaluate === 1)?.length
            })`}
          </div>
        </div>
        {/* list bình luận */}
        <hr className="my-3 " />
        <div className="max-h-[1000px] overflow-y-scroll">
          {valueComment
            ? valueComment
                ?.filter((item: any) =>
                  rateValueComment > 0
                    ? item?.evaluate === rateValueComment
                    : item?.evaluate !== rateValueComment
                )
                ?.map((item: any, index: any) => {
                  return (
                    <div key={index} className="bg-white p-3 rounded-lg">
                      <div>
                        <Avatar
                          style={{ verticalAlign: "middle" }}
                          className="bg-black text-white"
                          size="large"
                        >
                          {item?.name?.slice(0, 1)?.toUpperCase()}
                        </Avatar>
                        <span className="text-xl font-medium text-black ml-3">
                          {item?.name}
                        </span>
                        <div className="my-2">
                          <span className="text-lg font-mono text-black">
                            {item?.textcomment}
                          </span>
                          <div
                            onClick={() => {
                              showModal(item, index)
                            }}
                            className="cursor-pointer text-sm font-medium py-2"
                          >
                            Trả lời | <span>{moment(item?.createdAt).format("hh:mm:ss a - DD/MM/YYYY")}</span>
                          </div>
                          <hr />
                          <div className="flex flex-col ml-4">
                            {item?.replypeople?.map(
                              (itemReply: any, key: any) => {
                                return (
                                  <div
                                    key={key}
                                    className="my-2 bg-[#f5f5f5] rounded-xl p-3"
                                  >
                                    <div>
                                      <Avatar
                                        style={{ verticalAlign: "middle" }}
                                        className="bg-black text-white"
                                        size="large"
                                      >
                                        {itemReply?.nameComment
                                          ?.slice(0, 1)
                                          ?.toUpperCase()}
                                      </Avatar>
                                      <span className="text-xl font-medium text-black ml-3">
                                        {itemReply?.nameComment}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-mono text-black ml-3 pt-2">
                                        {itemReply?.nameComment}
                                      </div>
                                    </div>
                                    <div
                                      onClick={() => {showModal(item,key)}}
                                      className="cursor-pointer text-sm font-medium py-2"
                                    >
                                      Trả lời | <span>{moment(itemReply?.createdAt).format("hh:mm:ss a - DD/MM/YYYY")}</span>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <hr className="my-3" />
                    </div>
                  );
                })
            : "Chưa có bình luận nào"}
        </div>
      </div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => onClickReply()}>
            Hoàn tất
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
          <div>
            <textarea
              ref={inputRef}
              rows={5}
              cols={5}
              value={msg}
              placeholder={"Connecting..."}
              className="w-full h-full rounded border-[#9580ff] border-2 px-1 hover:border-[#8aff80] focus:border-[#80ffea] focus:outline-none"
              onChange={(e: any) => {
                setMsg(e.target.value);
              }}
              onKeyPress={(e: any) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <div className="mb-1">Đánh giá</div>{" "}
            <Rate tooltips={desc} onChange={setRateValue} value={rateValue} allowClear={false}/>{" "}
            <div className="flex w-full">
              <div className="w-1/2 mr-4">
                <CustomInput
                  label="Họ tên*"
                  name="username"
                  className="mb-2"
                  onChange={(e) => setUseValueName(e?.target?.value)}
                  value={useValueName}
                />
              </div>
              <div className="w-1/2 ml-4">
                <CustomInput
                  label="Số điện thoại*"
                  name="phone"
                  className="mb-2"
                  onChange={(e) => setUseValuePhone(e?.target?.value)}
                  value={useValuePhone}
                />
              </div>
            </div>
          </div>
      </Modal>
    </div>
  );
};

export default ChatComponent;
