import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";
import { FaArrowRight } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { LuBriefcase, LuBuilding, LuCreditCard, LuFileText, LuShield } from "react-icons/lu";


function page() {
  const businessFeatures = [
    {
      icon: FiUsers,
      heading: "Team Collaboration",
      body: "Invite team members and manage permissions"
    },
    {
      icon: LuFileText,
      heading: "Advanced Reporting",
      body: "Generate detailed business reports and analytics"
    },
    {
      icon: LuCreditCard,
      heading: "Multi-Account Support",
      body: "Connect multiple bank accounts and cards"
    },
    {
      icon: LuShield,
      heading: "Enhanced Security",
      body: "Advanced security features and compliance tools"
    },
    {
      icon: HiOutlineLightningBolt,
      heading: "Automated Workflows",
      body: "Set up automated invoicing and payment reminders"
    },
    {
      icon: LuBuilding,
      heading: "Business Insights",
      body: "AI-powered insights for better decision making"
    },
  ]

  const fAQs = [
    {
      heading: "Can I switch back to personal mode?",
      body: "Yes, you can switch between personal and business mode anytime without losing any data."
    },
    {
      heading: "What happens to my data during the trial?",
      body: "All your data is preserved. If you don't continue after the trial, you'll simply lose access to business features"
    },
    {
      heading: "Can I invite team members?",
      body: "Yes, business mode includes team collaboration features with role-based permissions."
    },
  ]
  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />
        <section className="content">
          <div className=" text-center">
            <div className="flex items-center justify-center mb-6">
              <div className=" p-5 w-20 rounded-2xl flex items-center justify-center bg-border">
                <LuBriefcase className=" text-primary text-4xl" />
              </div>
            </div>
            <h2 className=" mb-5">Business Mode</h2>
            <p>
              Unlock powerful business features designed for freelancers, side hustlers, and SMEs
            </p>
          </div>

          <div className=" text-white bg-primary flex flex-col items-center justify-center my-28 py-12 rounded-2xl">
            <h3 className=" ">Upgrade to Business Mode</h3>
            <p>
              Take control of your business finances with professional-grade tools
            </p>
            <div className=" flex items-center gap-x-3 my-5">
              <button className=" flex items-center gap-x-3 bg-card text-primary py-3 px-5 rounded-lg">Start Free Trial <FaArrowRight /> </button>
              <button className="py-3 px-5">Learn More</button>
              </div>
            <span>14-day free trial • No credit card required • Cancel anytime</span>
          </div>

          <div className="">
            <h3 className=" text-center">Business Features</h3>
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              {businessFeatures.map((businessFeature, index) => {
                const Icon = businessFeature.icon;
                return(
                <div className=" bg-card border-border border rounded-2xl p-5" key={index}>
                  <div className=" w-20">
                    <Icon className=" text-3xl"/>
                  </div>
                  <h4 className=" my-4 font-semibold text-xl">{businessFeature.heading}</h4>
                  <p>{businessFeature.body}</p>
                </div>
                )
              })}
            </div>
          </div>

          <div className=" mt-16 py-10  bg-card rounded-2xl border-border border">
            <h3 className=" text-center">Frequently Asked Questions</h3>
            <div className=" mt-6 space-y-4">
              {fAQs.map((fAQ, index) => (
                <div className=" bg-border p-5 rounded-xl mx-auto w-[90%] md:w-4/5" key={index}>
                  <h4 className=" font-semibold mb-3">{fAQ.heading}</h4>
                  <p>{fAQ.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default page