import React from 'react'
import * as image from "../../public/imagesURL";
import Image from "next/image";
import BannerBigImg from "../../style/assets/images/bg-img.png";
import placeholderImg from "../../style/assets/images/user-profile-pic.png";
import circleImage from "../../style/assets/images/youni-circle-img.png";

const SpiralView = () => {
  return (
    <div className="main-page-content spiral-view">
      <section className="circle-banner-image">
        <div className="circular-spiral-bg">
          <Image src={BannerBigImg} className="banner-bg-img" alt="banner" />
        </div>
        <div className="project-details">
          <div className="page-breadcrumb">
            <nav aria-label="breadcrumb">
              {/* <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Star Name</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">Moon Name</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Satellite Name
                </li>
              </ol> */}
            </nav>
          </div>

          <div className="project-name-details">
            <h2 className="project-page-name">2d Spiral</h2>
          </div>
        </div>
        <div className="mobile-add-project"></div>
        <div className="mobile-circular-spiral universe-page">
          <div className="mobile-spiral">
            <Image
              src={image.mobileSpiral}
              className="mobile-spiral-image"
              alt="Spiral Image"
            />
            <div className="mobile-center-circle-wrapper">
              <div className="center-circle-style">
                <Image
                  src={placeholderImg}
                  className="center-user-img"
                  alt="Spiral Center Image"
                />
              </div>
            </div>
            <div className="mobile-first-spiral">
              <span id="mobile-circle-img-1" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 1</div>
              </span>
              <span id="mobile-circle-img-2" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 2</div>
              </span>
              <span id="mobile-circle-img-3" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 3</div>
              </span>
              <span id="mobile-circle-img-4" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 4</div>
              </span>
              <span id="mobile-circle-img-5" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 5</div>
              </span>
              <span id="mobile-circle-img-6" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 6</div>
              </span>
              <span id="mobile-circle-img-7" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 7</div>
              </span>
              <span id="mobile-circle-img-8" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 8</div>
              </span>
              <span id="mobile-circle-img-9" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 9</div>
              </span>
              <span id="mobile-circle-img-10" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 10</div>
              </span>
              <span id="mobile-circle-img-11" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 11</div>
              </span>
              <span id="mobile-circle-img-12" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 12</div>
              </span>
            </div>
            <div className="mobile-second-spiral">
              <span id="mobile-circle-img-13" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 13</div>
              </span>
              <span id="mobile-circle-img-14" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 14</div>
              </span>
              <span id="mobile-circle-img-15" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 15</div>
              </span>
              <span id="mobile-circle-img-16" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 16</div>
              </span>
              <span id="mobile-circle-img-17" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 17</div>
              </span>
              <span id="mobile-circle-img-18" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 18</div>
              </span>
              <span id="mobile-circle-img-19" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 19</div>
              </span>
              <span id="mobile-circle-img-20" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 20</div>
              </span>
              <span id="mobile-circle-img-21" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 21</div>
              </span>
              <span id="mobile-circle-img-22" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 22</div>
              </span>
              <span id="mobile-circle-img-23" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 23</div>
              </span>
              <span id="mobile-circle-img-24" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 24</div>
              </span>
            </div>
            <div className="mobile-third-spiral">
              <span id="mobile-circle-img-25" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 25</div>
              </span>
              <span id="mobile-circle-img-26" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 26</div>
              </span>
              <span id="mobile-circle-img-27" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 27</div>
              </span>
              <span id="mobile-circle-img-28" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 28</div>
              </span>
              <span id="mobile-circle-img-29" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 29</div>
              </span>
              <span id="mobile-circle-img-30" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 30</div>
              </span>
              <span id="mobile-circle-img-31" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 31</div>
              </span>
              <span id="mobile-circle-img-32" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 32</div>
              </span>
              <span id="mobile-circle-img-33" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 33</div>
              </span>
              <span id="mobile-circle-img-34" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 34</div>
              </span>
              <span id="mobile-circle-img-35" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 35</div>
              </span>
              <span id="mobile-circle-img-36" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 36</div>
              </span>
            </div>
            <div className="mobile-fourth-spiral">
              <span id="mobile-circle-img-37" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 37</div>
              </span>
              <span id="mobile-circle-img-38" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 38</div>
              </span>
              <span id="mobile-circle-img-39" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 39</div>
              </span>
              <span id="mobile-circle-img-40" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 40</div>
              </span>
              <span id="mobile-circle-img-41" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 41</div>
              </span>
              <span id="mobile-circle-img-42" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 42</div>
              </span>
              <span id="mobile-circle-img-43" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 43</div>
              </span>
              <span id="mobile-circle-img-44" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 44</div>
              </span>
              <span id="mobile-circle-img-45" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 45</div>
              </span>
              <span id="mobile-circle-img-46" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 46</div>
              </span>
              <span id="mobile-circle-img-47" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 47</div>
              </span>
              <span id="mobile-circle-img-48" className="mobile-circle" style={{ backgroundImage: `url(${circleImage.src})` }}>
                <div className="mobile-project-name">Star Name 48</div>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SpiralView