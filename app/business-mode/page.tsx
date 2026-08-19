import Header from "@/component/Header";
import Siderbar from "@/component/Siderbar";

import { FaArrowRight } from "react-icons/fa";
import { FiTrendingUp, FiUsers } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import {
  LuBriefcase,
  LuBuilding,
  LuCreditCard,
  LuFileText,
  LuShield,
} from "react-icons/lu";

type BusinessFeature = {
  icon: React.ElementType;
  heading: string;
  body: string;
};

type FAQ = {
  heading: string;
  body: string;
};

const businessFeatures: BusinessFeature[] = [
  {
    icon: FiUsers,
    heading: "Team Collaboration",
    body: "Invite team members and manage permissions",
  },
  {
    icon: LuFileText,
    heading: "Advanced Reporting",
    body: "Generate detailed business reports and analytics",
  },
  {
    icon: LuCreditCard,
    heading: "Multi-Account Support",
    body: "Connect multiple bank accounts and cards",
  },
  {
    icon: LuShield,
    heading: "Enhanced Security",
    body: "Advanced security features and compliance tools",
  },
  {
    icon: HiOutlineLightningBolt,
    heading: "Automated Workflows",
    body: "Set up automated invoicing and payment reminders",
  },
  {
    icon: LuBuilding,
    heading: "Business Insights",
    body: "AI-powered insights for better decision making",
  },
];

const faqs: FAQ[] = [
  {
    heading: "Can I switch back to personal mode?",
    body: "Yes, you can switch between personal and business mode anytime without losing any data.",
  },
  {
    heading: "What happens to my data during the trial?",
    body: "All your data is preserved. If you don't continue after the trial, you'll simply lose access to business features.",
  },
  {
    heading: "Can I invite team members?",
    body: "Yes, business mode includes team collaboration features with role-based permissions.",
  },
];

export default function Page() {
  return (
    <div>
      <Header />

      <div className="relative md:flex">
        <Siderbar />

        <section className="content">
          {/* ================================
              HERO
          ================================= */}

          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-5 w-20 h-20 rounded-2xl flex items-center justify-center bg-border">
                <LuBriefcase className="text-primary text-4xl" />
              </div>
            </div>

            <h2 className="mb-5 text-2xl md:text-3xl font-bold">
              Business Mode
            </h2>

            <p className="max-w-2xl mx-auto">
              Unlock powerful business features designed for freelancers,
              side hustlers, and SMEs.
            </p>
          </div>

          {/* ================================
              UPGRADE CTA
          ================================= */}

          <div className="text-white bg-primary flex flex-col items-center justify-center my-16 md:my-28 py-10 md:py-12 px-6 rounded-2xl text-center">
            <h3 className="text-xl md:text-2xl font-semibold">
              Upgrade to Business Mode
            </h3>

            <p className="mt-3 max-w-xl">
              Take control of your business finances with professional-grade
              tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 my-6">
              <button
                type="button"
                className="flex items-center justify-center gap-x-3 bg-card text-primary py-3 px-5 rounded-lg cursor-pointer hover:opacity-90 transition"
              >
                Start Free Trial
                <FaArrowRight />
              </button>

              <button
                type="button"
                className="py-3 px-5 cursor-pointer hover:underline"
              >
                Learn More
              </button>
            </div>

            <span className="text-sm opacity-90">
              14-day free trial • No credit card required • Cancel anytime
            </span>
          </div>

          {/* ================================
              BUSINESS FEATURES
          ================================= */}

          <div>
            <h3 className="text-center text-xl md:text-2xl font-semibold">
              Business Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6">
              {businessFeatures.map((businessFeature) => {
                const Icon = businessFeature.icon;

                return (
                  <div
                    className="bg-card border-border border rounded-2xl p-5"
                    key={businessFeature.heading}
                  >
                    <div className="w-20 h-12 flex items-center">
                      <Icon className="text-3xl text-primary" />
                    </div>

                    <h4 className="my-4 font-semibold text-xl">
                      {businessFeature.heading}
                    </h4>

                    <p>{businessFeature.body}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================
              BENEFITS + PRICING
          ================================= */}

          <div className="flex flex-col md:flex-row gap-7 mt-16">
            {/* KEY BENEFITS */}

            <div className="bg-card border border-border flex-1 p-6 md:p-8 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-border text-green-500 flex items-center justify-center shrink-0">
                  <FiTrendingUp className="text-xl" />
                </div>

                <h3 className="text-xl font-semibold">
                  Key Benefits
                </h3>
              </div>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0" />
                  <span>Separate business and personal finances clearly</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Tax-ready reports and documentation</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Expense categorization for business deductions</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Invoice and payment tracking</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Client and vendor management</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Cash flow forecasting</span>
                </li>
              </ul>
            </div>

            {/* PRICING */}

            <div className="bg-card border border-border flex-1 p-6 md:p-8 rounded-2xl">
              <h3 className="text-xl font-semibold">
                Pricing
              </h3>

              <div className="mt-4">
                <div>
                  <span className="text-2xl font-bold">
                    $29
                  </span>

                  <span className="ml-1">
                    /month
                  </span>
                </div>

                <p className="mt-1">
                  Billed monthly, cancel anytime
                </p>
              </div>

              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>All business features included</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Unlimited transactions</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Priority support</span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 mt-2 rounded-full bg-green-600 shrink-0" />
                  <span>Advanced export options</span>
                </li>
              </ul>

              <button
                type="button"
                className="w-full bg-primary text-white rounded-xl mt-6 py-3 px-4 flex items-center justify-center gap-x-3 cursor-pointer hover:opacity-90 transition"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* ================================
              FAQ
          ================================= */}

          <div className="mt-16 py-10 bg-card rounded-2xl border-border border">
            <h3 className="text-center text-xl md:text-2xl font-semibold">
              Frequently Asked Questions
            </h3>

            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <div
                  className="bg-border p-5 rounded-xl mx-auto w-[90%] md:w-4/5"
                  key={faq.heading}
                >
                  <h4 className="font-semibold mb-3">
                    {faq.heading}
                  </h4>

                  <p>{faq.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}