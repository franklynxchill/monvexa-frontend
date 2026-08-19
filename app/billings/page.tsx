import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import Link from "next/link";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { LuCreditCard } from "react-icons/lu";

function page() {
  return (
    <div>
      <Header />
      
      <div className="relative md:flex">
        <Siderbar />
        <section className="content">
          <div className="w-full">
            <h1>Billing & Subscription</h1>
            <p>Manage your subscription and billing information</p>
          </div>

          <div className=" flex flex-col lg:flex-row items-center justify-between gap-y-5 bg-card border border-border rounded-2xl py-7 px-8 mt-10">
            <div className="w-full">
              <h3 className=" font-semibold mb-2">Current Plan: Free <span className=" text-green-600 bg-green-300/20 rounded-full py-2 px-4 ml-2 text-base font-normal">Active</span></h3>
              <p>You're currently on the free plan</p>
            </div>
            <div className=" w-full md:w-1/4 text-center">
              <Link href="/new-transaction" className=" py-4 px-4 rounded-2xl bg-primary text-white flex items-center justify-center gap-x-3">
                <HiOutlineLightningBolt className=" text-xl"/>
                Upgrade Plan
              </Link>
            </div>
          </div>

          <div className=" flex flex-col bg-card border border-border rounded-2xl py-7 px-8 mt-10">
            <div className=" flex items-center justify-between">
              <h3 className=" font-semibold">Payment Method</h3>
              <Link href="" className=" text-primary font-bold">Add Method</Link>
            </div>
            <div className=" flex items-center justify-between mt-3">
              <div className=" flex flex-row items-start gap-x-5">
                <div className=" bg-border text-primary rounded-xl p-3">
                  <LuCreditCard className=" text-2xl" />
                </div>
                <div className="">
                  <span className=" font-semibold mb-2">No payment method </span>
                  <p>Add a payment method to upgrade your plan</p>
                </div>
              </div>
              <div className="">
                <Link href="" className="">
                  <IoIosArrowForward className=" text-xl"/>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default page