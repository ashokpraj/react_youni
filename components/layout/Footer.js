import Image from "next/image";
import * as image from "../../public/imagesURL";

const Footer = () => {
  return (
    <>
      <footer className="page-footer">
        <div className="container">
          <div className="page-footer-content">
            <p>
              © Copyright {new Date().getFullYear()}{" "}
              <a href="https://www.getyouni.com/" target='_blank'>getyouni</a> Pvt. Ltd. All
              rights reserved.
            </p>
            <ul className="social-links">
              <li>
                <a
                 href='https://www.facebook.com/'
                  target='_blank'
                  aria-label='Facebook'>
                  <Image src={image.Fbimage} />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target='_blank'>
                  <Image src={image.Instaimage} />
                </a>
              </li>
              <li>
                <a href="https://in.pinterest.com/" target='_blank'>
                  <Image src={image.Printimage} />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/i/flow/login" target='_blank'>
                  <Image src={image.Twitterimage} />
                </a>
              </li>
              <li>
                <a href="https://www.google.com/intl/en-GB/gmail/about/" target='_blank'>
                  <Image src={image.Googleimage} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
