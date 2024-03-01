import { Card } from 'antd';
import Link from 'next/link';
import React from 'react'

const ListProduct = ({valueproduct}: any) => {
  return (
    <div className="flex justify-center">
    <div className="flex w-10/12 justify-center mt-3">
      <div className="w-full grid grid-cols-1 gap-1 lg:grid-cols-4 lg:gap-4 sm:grid-cols-1 sm:gap-1 md:grid-cols-2 md:gap-2 xl:grid-cols-6 xl:gap-6">
        {valueproduct.map((item: any) => {
          return (
            item.key >= 1 &&
            item.key <= 6 && (
              <div
                className={`${
                  item.key > 1 && item.key < 6 ? "mr-1" : ""
                }`}
                key={item.key}
              >
                <Link href={item?.link}>
                <Card
                  hoverable
                  cover={<img alt="example" src={item?.imgage} />}
                >
                  <div className="mt-1">
                    <h5 className="text-base font-medium	text-center">
                      {item?.label}
                    </h5>
                    <p className="text-sx font-medium	text-center text-red-500">
                      <span className="">{item?.price} </span>đ
                    </p>
                    <p className="font-medium	text-sx text-center">
                      Liên hệ
                    </p>
                  </div>
                </Card>
                </Link>
              </div>
            )
          );
        })}
      </div>
    </div>
  </div>
  )
}

export default ListProduct