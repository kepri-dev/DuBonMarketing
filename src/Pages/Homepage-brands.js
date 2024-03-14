import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import "./Homepage-brands.css";
import { storage } from "../Context/firebase";
import { imageListItemBarClasses } from "@mui/material";

export default function Homepagebrands() {
  const [previousWork, setPreviousWork] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [stepOne, setStepOne] = useState([]);
  const [stepTwo, setStepTwo] = useState([]);
  const [stepThree, setStepThree] = useState([]);
  const [backgroundImg, setBackgroundImg] = useState([]);
  const [firstCustomer, setFirstCustomer] = useState([]);
  const [secondCustomer, setSecondCustomer] = useState([]);
  const [thirdCustomer, setThirdCustomer] = useState([]);

  const fetchImageUrls = (folderPath, setStateCallback) => {
    const folderRef = ref(storage, folderPath);
    listAll(folderRef)
      .then((res) => {
        const promises = res.items.map((itemRef) => getDownloadURL(itemRef));
        Promise.all(promises)
          .then((urls) => {
            setStateCallback(urls);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchImageUrls("mockLogos/", setImageUrls);
    fetchImageUrls("headerHomepage/", setPreviousWork);
    fetchImageUrls("StepOne/", setStepOne);
    fetchImageUrls("StepTwo/", setStepTwo);
    fetchImageUrls("StepThree/", setStepThree);
    fetchImageUrls("BackgroundImageHomePage/", setBackgroundImg);
    fetchImageUrls("FirstCustomer/", setFirstCustomer);
    fetchImageUrls("SecondCustomer/", setSecondCustomer);
    fetchImageUrls("ThirdCustomer/", setThirdCustomer);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "What is a UGC ?",
      answer:
        "UGC (User-Generated Content) is brand-centric content created by everyday consumers and shared on social media. UGC differs from influencer content in that it focuses on your brand and your audience, not on influencers.",
    },
    {
      question: "Why use UGC ?",
      answer:
        "People no longer want to be sold products; they prefer to discover a product for themselves by experiencing it through the eyes of people like them. People buy with their emotions, not with their wallets, and they want to feel like they are buying from a friend who understands them. The need for UGC is becoming more and more important as it allows you to present your product in an authentic way to your audience and overcome their possible objections.",
    },
    {
      question: "Can I use your platform on behalf of my clients ?",
      answer:
        "Absolutely! Youdji is designed to be a flexible platform that can accommodate the needs of a variety of users, including agency owners. Whether you're seeking UGC creators for your own brand or on behalf of your clients, Youdji makes it simple and straightforward to find the right fit.",
    },
  ];

  const toggleFaq = (faqIndex) => {
    setActiveFaq((prevActiveFaq) =>
      prevActiveFaq !== faqIndex ? faqIndex : null
    );
  };

  return (
    <div>
      <div className="headline-div">
        <div className="headline-text">
          <h1>Connect with Premier UGC Creators and Elevate Your Brand</h1>
          <h2>
            Discover a world of creative talent with Du Bon Marketing, your
            gateway to top-tier UGC creators.
          </h2>
          <button>Explore Creators</button>
        </div>
        <div className="headline-image">
          {previousWork.map((url, index) => (
            <img key={index} src={url} alt="Firebase File" className="logos" />
          ))}
        </div>
      </div>
      <div className="case-studies-div">
        <h2>1000+ brands & agencies work with our creators</h2>
        <div className="logos-hp">
          <div className="logos-slide-hp">
            {imageUrls.concat(imageUrls, imageUrls).map((url, index) => (
              <img key={index} src={url} alt="Firebase File" />
            ))}
          </div>
        </div>{" "}
      </div>
      <div className="how-to-use-div">
        <h1>Seamless Collaboration Awaits on DBM</h1>
        <div className="how-to-use-steps">
          <div>
            <h1>Step 1: Discover UGC Talent</h1>
            <p>
              Peruse our curated selection of over 800+ creators and find the
              perfect match for your brand's vision.
            </p>
            <button>Discover Now</button>
          </div>
          <div>
            {stepOne.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Firebase File"
                className="logos"
              />
            ))}
          </div>
        </div>
        <div className="how-to-use-steps">
          <div>
            <h1>Step 2: Engage with Creators</h1>
            <p>
              Initiate conversations, brainstorm ideas, and set the stage for
              remarkable content creation.
            </p>
            <button>Start the Conversation</button>
          </div>
          <div>
            {stepTwo.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Firebase File"
                className="logos"
              />
            ))}
          </div>
        </div>
        <div className="how-to-use-steps">
          <div>
            <h1>Step 3: Curate Your Favorites</h1>
            <p>
              Compile a tailored list of your favorite UGC creators for quick
              access and efficient project launches.
            </p>
            <button>Curate Your List</button>
          </div>
          <div>
            {stepThree.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Firebase File"
                className="logos"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="benefits-div">
        <h1>Why UGC? The Answer is Clear.</h1>
        <div>
          <div>
            <h2>Trust and Authenticity</h2>
            <p>
              UGC embodies the genuine experiences of like-minded consumers,
              fostering trust and authenticity in your brand.
            </p>
          </div>
          <div>
            <h2>Enhanced Engagement</h2>
            <p>
              Leverage UGC's natural engagement to captivate audiences and drive
              meaningful interactions.
            </p>
          </div>
          <div>
            <h2>Impactful Influence</h2>
            <p>
              Harness the persuasive power of real-world endorsements,
              outshining traditional influencer marketing.
            </p>
          </div>
        </div>
      </div>
      <div className="previous-work-div"></div>

      <div className="market-research-div">
        <div className="market-research-content">
          <div className="market-research-intro">
            <div className="market-research-text">
              <h1>DBM: A Global Hub of UGC Mastery</h1>
              <p>
                Thanks to DBM, partner with the world's most extensive network
                of UGC creators to showcase your product on a global scale.
              </p>
              <p>
                {" "}
                Uncover talents who will adeptly capture your brand's essence
                and represent it in innovative ways.{" "}
              </p>
              <p>
                Leverage this content for your advertisements on platforms like
                Facebook, Instagram, TikTok, or boost your organic presence.{" "}
              </p>
              <p>All swiftly and effortlessly.</p>
              <button className="comparison-action">Join Our Community</button>
            </div>

            <div className="background-market-research">
              {backgroundImg.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Firebase File"
                  className="background-market"
                />
              ))}
            </div>
          </div>
          <div className="market-research-stats">
            <div className="stat">
              <h1>2100+ creators</h1>
              <p>available with advanced filtering.</p>
            </div>
            <div className="stat">
              <h1>62+ languages</h1>
              <p>spoken by our creators.</p>
            </div>
            <div>
              <h1>4,9/5 score</h1>
              <p>accross thousands of UGCs delivered.</p>
            </div>
          </div>
          <div className="market-research-comparison">
            <div className="comparison-question">
              <h1>DBM or not DBM?</h1>
              <p>That is the question.</p>
            </div>
            <div>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Features</th>
                    <th className="DBM-Column">DBM</th>
                    <th>Other UGC Platforms</th>
                    <th>UGC Agencies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="table-features">Pricing per month</td>
                    <td className="DBM-Column">0$ / month</td>
                    <td>200$/month</td>
                    <td>1000$/month</td>
                  </tr>
                  <tr>
                    <td className="table-features">
                      Transaction fees for brands
                    </td>
                    <td className="DBM-Column">0%</td>
                    <td>Variable %</td>
                    <td>N/A</td>
                  </tr>
                  <tr>
                    <td className="table-features">
                      Average UGC delivery time
                    </td>
                    <td className="DBM-Column">Under a week</td>
                    <td>At least 2 weeks</td>
                    <td>More than 3 weeks</td>
                  </tr>
                  <tr>
                    <td className="table-features">
                      Direct communication with creators
                    </td>
                    <td className="DBM-Column">✓</td>
                    <td>✗</td>
                    <td>✗</td>
                  </tr>

                  <tr>
                    <td className="table-features">
                      Precise targeting through filtered search
                    </td>
                    <td className="DBM-Column">✓</td>
                    <td>✗</td>
                    <td>✗</td>
                  </tr>
                  <tr>
                    <td className="table-features">
                      Unlimited creator contacts
                    </td>
                    <td className="DBM-Column">✓</td>
                    <td>✗</td>
                    <td>✗</td>
                  </tr>
                  <tr>
                    <td className="table-features">
                      Comprehensive UGC creator portfolios
                    </td>
                    <td className="DBM-Column">✓</td>
                    <td>✗/✓</td>
                    <td>✗/✓</td>
                  </tr>
                  <tr>
                    <td className="table-features">Verified creators</td>
                    <td className="DBM-Column">✓</td>
                    <td>✗/✓</td>
                    <td>✗/✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <button className="comparison-action">
                See all the creators{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="testimonials-section">
        <h1 className="testimonials-header">Hear It From Our Clients</h1>
        <div className="testimonials-container">
          {firstCustomer.map((url, index) => (
            <div key={index} className="customer-review">
              <div className="customer-image">
                <img src={url} alt="Customer" />
              </div>
              <div className="customer-content">
                <h2>Manon Roch</h2>
                <p className="customer-title">Co-founder @Cosmy</p>
                <p className="customer-testimonial">
                  “At Cosmy, we've used Youdji several times to find UGC
                  creators for our clients. It's a must-have ✨.”
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="faq-section">
        <h1 className="faq-header">Frequently Asked Questions</h1>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="single-faq">
              <button className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
              </button>
              <div
                className={
                  activeFaq === index ? "faq-answer-active" : "faq-answer"
                }
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
