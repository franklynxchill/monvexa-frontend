import Header from "@/component/Header"
import Siderbar from "@/component/Siderbar"
import Link from "next/link"
import { FaArrowTrendUp } from "react-icons/fa6"
import { FiPlus } from "react-icons/fi"
import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io"

function page() {
  return (
    <div>
      <Header />
      
      <div className="relative md:flex">
        <Siderbar />
        <section className="content">
          <div className=" flex flex-col lg:flex-row items-center justify-between gap-y-5">
            <div className="w-full">
              <h1>Budgets</h1>
              <p>Track and manage your spending limits</p>
            </div>
            <div className=" w-full md:w-1/4 text-center">
              <Link href="/new-transaction" className=" py-3 px-4 rounded-2xl bg-primary text-white flex items-center justify-center gap-x-3">
                <FiPlus className=" text-xl"/>
                Create Budget
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-6">
  
              {/* Total Allocated */}
              <div className="flex-1 bg-card border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Total Allocated</p>
              </div>

              {/* Total Spent */}
              <div className="flex-1 bg-card border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Total Spent</p>
              </div>
  
              {/* Total Remaining */}
              <div className="flex-1 bg-card border rounded-2xl p-4">
                <p className="text-gray-500 text-sm">Remaining</p>
              </div>
          </div>

          <div className=""></div>

          <div className=" flex flex-row items-start mt-16 bg-border border border-primary/25 rounded-3xl gap-5 p-8">
            <div className=" bg-primary text-white rounded-2xl p-3">
              <FaArrowTrendUp className=" text-2xl" />
            </div>
            <div className="">
              <h3 className=" font-semibold">Budget Management Tips</h3>
              <ul className=" list-disc ml-5 mt-2">
                <li>Review your budgets monthly to ensure they align with your goals</li>
                <li>Set alerts when you reach 80% of any budget category</li>
                <li>Use historical spending data to create more accurate budget allocations</li>
                <li>Consider seasonal variations when planning your budgets</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default page