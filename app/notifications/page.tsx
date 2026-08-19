import Header from "@/component/Header"
import Siderbar from "@/component/Siderbar"
import { GoBell } from "react-icons/go"

const page = () => {
  return (
    <div>      
      <Header/>

      <div className="relative md:flex">
        <Siderbar />

        <div className="content">
          <div className="">
            <h2 className=" text-2xl font-bold">Notifications</h2>
            <p>Stay updated with your financial activities</p>
          </div>

          <div className=" flex flex-col md:flex-row md:justify-between items-center mt-16 bg-border border border-primary/25 rounded-3xl gap-4 p-8">
            <div className=" w-full">
              <h3 className=" mb-3 font-semibold">Notification Preferences</h3>
              <p>
                Customize what notifications you receive and how
              </p>
            </div>
            <div className="w-full md:w-[20rem] text-center">
              <button className=" w-full bg-primary text-white rounded-xl py-3 px-4 flex items-center justify-center gap-x-3">
                <GoBell className=" text-2xl"/> Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page