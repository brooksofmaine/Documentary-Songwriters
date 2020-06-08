import React from 'react';
import './LoginImages.css';

/*
 * Low-level component for rendering images and graphics
 */
class LoginImages extends React.Component {
    
    render() {
        // only renders the boy if Login showing, not Register for best visibility
        const boyStyle= this.props.boyVisible ? { display: "block" } : { display: "none" }

        /*
         * Renders decorative lines, boy, girl, and their respective music bubbles
         */
        return(
            <div>
                <div className="LoginLowerBubble" style={boyStyle}>
                    <svg width="271" height="191" viewBox="0 0 271 191" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M23.3591 181.429C35.5352 175.902 57.0011 199.161 106.256 170.311C155.51 141.461 154.913 104.589 182.284 88.3409C209.656 72.0932 237.023 103.049 258.549 79.9081C280.076 56.7675 267.599 18.049 258.549 6.35777C249.5 -5.33344 247.352 0.572304 206.124 12.1797C164.896 23.7871 154.983 37.083 127.356 43.2939C99.7292 49.5049 90.4952 21.8493 67.7239 43.2939C44.9526 64.7386 65.8211 91.1106 53.7519 112.61C41.6826 134.11 18.9937 130.854 8.69198 148.451C-1.60979 166.048 0.647416 185.506 2.4592 189.58C4.27099 193.653 11.1831 186.956 23.3591 181.429Z" fill="#C9C9C9" fillOpacity="0.19"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M64.1013 107.409C63.1411 110.472 62.4789 107.409 58.3841 107.409C54.9986 107.409 50.9947 113.372 54.2507 117.873C57.5067 122.373 61.5756 120.881 64.1013 118.885C65.8829 117.476 66.9351 113.926 66.9351 111.338C66.9351 108.75 66.8093 78.6154 66.8093 78.6154C66.8093 78.6154 64.3024 72.4297 63.5862 73.879C63.5132 74.0266 63.9937 73.6966 63.9879 74.3007C63.9375 79.6248 66.1321 100.929 64.1013 107.409Z" fill="#303D8B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M44.8356 106.721C43.8754 109.784 43.2132 106.721 39.1184 106.721C35.7329 106.721 31.729 112.684 34.985 117.185C38.241 121.685 42.3099 120.193 44.8356 118.197C46.6173 116.788 47.6694 113.237 47.6694 110.65C47.6694 108.062 47.6694 80.1788 47.6694 80.1788C47.6694 80.1788 63.1158 75.8234 64.4055 81.069C65.6951 86.3147 68.5732 77.8519 65.2994 73.9961C62.0256 70.1402 45.5518 71.0133 44.8356 72.4625C44.1194 73.9118 47.0969 99.5055 44.8356 106.721Z" fill="#303D8B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M103.424 57.8509C102.475 60.908 101.82 57.8509 97.7724 57.8509C94.4256 57.8509 90.4675 63.802 93.6862 68.2926C96.905 72.7833 100.927 71.2951 103.424 69.3028C105.185 67.8973 106.226 64.3539 106.226 61.7716C106.226 59.1892 106.226 31.3651 106.226 31.3651C106.226 31.3651 111.756 33.5684 113.031 38.803C114.306 44.0375 112.45 55.1075 113.031 56.9943C113.613 58.881 115.367 52.8475 116.355 49.585C117.342 46.3225 118.233 40.1415 114.996 36.2938C111.76 32.4461 104.132 22.219 103.424 23.6651C102.716 25.1113 105.66 50.651 103.424 57.8509Z" fill="#F7B844" fillOpacity="0.553376"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M225.568 82.6384C224.608 85.702 223.946 82.6384 219.851 82.6384C216.466 82.6384 212.462 88.6021 215.718 93.1023C218.974 97.6024 223.043 96.1112 225.568 94.1146C227.35 92.7061 228.402 89.1553 228.402 86.5674C228.402 83.9796 228.276 53.8451 228.276 53.8451C228.276 53.8451 225.769 47.6595 225.053 49.1087C224.98 49.2564 225.461 48.9263 225.455 49.5304C225.404 54.8546 227.599 76.1585 225.568 82.6384Z" fill="#8EACCD"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M206.302 81.9503C205.342 85.0139 204.68 81.9503 200.585 81.9503C197.199 81.9503 193.195 87.914 196.451 92.4141C199.707 96.9143 203.776 95.423 206.302 93.4264C208.084 92.0179 209.136 88.4671 209.136 85.8793C209.136 83.2915 209.136 55.4085 209.136 55.4085C209.136 55.4085 224.582 51.053 225.872 56.2986C227.161 61.5443 230.04 53.0815 226.766 49.2257C223.492 45.3698 207.018 46.2429 206.302 47.6922C205.586 49.1414 208.563 74.7351 206.302 81.9503Z" fill="#8EACCD"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M256.634 40.4198C255.684 43.4769 255.03 40.4198 250.982 40.4198C247.635 40.4198 243.677 46.3709 246.896 50.8616C250.115 55.3522 254.137 53.8641 256.634 51.8717C258.395 50.4662 259.435 46.9229 259.435 44.3406C259.435 41.7582 259.435 13.9341 259.435 13.9341C259.435 13.9341 264.966 16.1374 266.241 21.3719C267.516 26.6065 265.659 37.6765 266.241 39.5633C266.822 41.45 268.577 35.4165 269.564 32.154C270.552 28.8915 271.442 22.7104 268.206 18.8627C264.97 15.015 257.342 4.78793 256.634 6.2341C255.926 7.68026 258.869 33.2199 256.634 40.4198Z" fill="#16295D"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M88.7454 145.923C87.7962 148.981 87.1416 145.923 83.0936 145.923C79.7468 145.923 75.7887 151.875 79.0075 156.365C82.2262 160.856 86.2486 159.368 88.7454 157.375C90.5066 155.97 91.5467 152.426 91.5467 149.844C91.5467 147.262 91.5467 119.438 91.5467 119.438C91.5467 119.438 97.0776 121.641 98.3525 126.876C99.6274 132.11 97.7709 143.18 98.3525 145.067C98.9341 146.954 100.688 140.92 101.676 137.658C102.664 134.395 103.554 128.214 100.318 124.366C97.0814 120.519 89.4534 110.292 88.7454 111.738C88.0373 113.184 90.9808 138.724 88.7454 145.923Z" fill="#8892B7" fillOpacity="0.528354"/>
                    </svg>
                </div>
                <div className="LoginBoy" style={boyStyle}>
                    <svg width="188" height="355" viewBox="0 0 188 355" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M91.9532 301.777L86.683 319.786L97.4361 324.548L107.942 308.425L91.9532 301.777Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M141.862 320.648L143.334 335.787H156.409L158.302 320.648H141.862Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M86.178 302.414L125.194 212.839C133.881 198.864 158.238 215.683 155.275 223.788C148.549 242.189 111.59 305.432 109.586 310.914L86.178 302.414Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M173.214 228.385C173.214 252.758 161.64 316.951 161.632 322.318L136.728 322.337C136.728 322.337 142.196 238.903 140.606 238.084C139.016 237.264 75.4222 244.433 56.3495 244.433C28.8465 244.433 17.4691 227.089 16.5459 194.961H71.0282C82.1213 196.148 139.984 207.819 161.473 211.831C170.673 213.548 173.214 221.671 173.214 228.385Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M76.9672 70.2151L75.014 88.7993C75.014 88.7993 67.7765 90.8338 62.0505 89.6167C56.3244 88.3996 51.8033 82.067 51.8033 82.067L62.8354 62.2494C62.8354 62.2494 55.5723 37.2256 63.5402 26.7027C71.5081 16.1797 90.7491 12.8889 100.121 27.9483C109.493 43.0078 99.9978 70.591 98.7261 75.7345C97.4544 80.8781 76.9672 70.2151 76.9672 70.2151Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M58.6368 57.3126C57.4736 57.0654 52.3113 31.9703 53.0569 25.6731C53.8025 19.3758 63.5331 15.9578 63.5331 15.9578C63.5331 15.9578 72.8086 3.2163 94.3573 12.646C115.906 22.0758 107.075 38.7478 106.366 40.172C105.656 41.5962 94.1797 36.2005 89.1657 37.071C84.1516 37.9416 83.2977 44.4712 82.2804 44.7208C81.2631 44.9703 78.5518 43.9282 78.2251 43.8588C77.8984 43.7894 75.9983 34.2722 70.732 36.1536C65.4657 38.0351 66.4282 45.948 66.4282 45.948C66.4282 45.948 63.1938 58.2812 62.1524 58.0599C61.1109 57.8385 59.8 57.5599 58.6368 57.3126Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M90.4115 115.997C90.4115 115.997 99.1239 149.885 99.884 146.309C100.644 142.733 108.282 103.241 108.282 103.241L116.512 103.735C116.512 103.735 112.044 166.94 105.047 170.796C98.0511 174.652 84.908 145.308 79.8928 133.113C74.8776 120.917 78.9375 119.541 78.9375 119.541L90.4115 115.997Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M80.0122 89.0964C70.6543 82.0677 63.4689 89.658 63.6284 98.3674C63.788 107.077 70.5196 120.963 71.2092 121.699C71.8988 122.435 95.0646 113.947 95.6082 113.771C96.1518 113.594 89.3701 96.1252 80.0122 89.0964Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M53.1388 75.7855C53.1388 75.7855 35.3086 89.5037 24.5328 114.78C13.7571 140.056 3.67462 207.233 8.82129 206.347C10.0354 206.138 16.4243 201.415 23.2317 199.371C36.5683 195.368 74.4425 194.795 78.6652 195.692C81.4716 196.289 76.3495 82.5177 76.3495 82.5177C76.3495 82.5177 68.0806 84.333 63.386 83.3351C58.6915 82.3373 53.1388 75.7855 53.1388 75.7855Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M105.868 69.196C107.674 70.9577 115.006 74.6354 116.787 78.3118C118.568 81.9882 67.3645 144.22 62.559 155.887C57.7535 167.555 66.9975 181.918 76.9413 185.568C86.8852 189.219 103.91 185.568 109.684 174.989C115.459 164.409 118.617 158.653 122.485 155.887C126.353 153.122 130.732 161.21 130.732 159.349C130.732 157.489 130.591 124.798 129.733 126.478C128.875 128.157 126.46 128.339 125.332 128.157C120.14 127.322 115.637 126.763 109.684 131.757C98.8153 140.876 96.4639 162.332 90.5524 159.349C87.735 157.928 93.7771 143.83 105.868 116.829C110.69 106.062 122.485 81.985 122.485 78.3118C122.485 74.6385 108.71 67.307 107.674 66.7385C106.638 66.17 104.062 67.4343 105.868 69.196Z" fill="#F8F8F8"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M104.616 73.1656C106.421 74.9274 113.754 78.605 115.535 82.2814C117.315 85.9578 66.112 148.189 61.3065 159.857C56.501 171.525 65.745 185.887 75.6888 189.538C85.6327 193.189 102.658 189.538 108.432 178.958C114.206 168.379 117.365 162.623 121.233 159.857C125.101 157.091 129.48 165.179 129.48 163.319C129.48 161.459 129.338 128.767 128.48 130.447C127.622 132.127 125.208 132.309 124.079 132.127C118.887 131.291 114.384 130.732 108.432 135.726C97.5628 144.845 95.2114 166.302 89.2999 163.319C86.4825 161.897 92.5246 147.799 104.616 120.799C109.438 110.031 121.233 85.9547 121.233 82.2814C121.233 78.6081 107.458 71.2766 106.421 70.7081C105.385 70.1396 102.81 71.4039 104.616 73.1656Z" fill="#F7B844"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M105.868 69.196C107.674 70.9577 115.006 74.6354 116.787 78.3118C118.568 81.9882 67.3645 144.22 62.559 155.887C57.7535 167.555 66.9975 181.918 76.9414 185.568C86.8852 189.219 103.91 185.568 109.684 174.989C115.459 164.409 118.617 158.653 122.485 155.887C126.353 153.122 130.732 161.21 130.732 159.349C130.732 157.489 130.591 124.798 129.733 126.478C128.875 128.157 126.46 128.339 125.332 128.157C120.14 127.322 115.637 126.763 109.684 131.757C98.8153 140.876 96.4639 162.332 90.5524 159.349C87.735 157.928 93.7771 143.83 105.868 116.829C110.69 106.062 122.485 81.985 122.485 78.3118C122.485 74.6385 108.71 67.307 107.674 66.7385C106.638 66.17 104.062 67.4343 105.868 69.196Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M83.8439 176.601C86.3773 176.601 88.431 174.548 88.431 172.014C88.431 169.481 86.3773 167.427 83.8439 167.427C81.3105 167.427 79.2568 169.481 79.2568 172.014C79.2568 174.548 81.3105 176.601 83.8439 176.601Z" fill="#A67A29"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M99.0181 174.102C101.552 174.102 103.605 172.048 103.605 169.515C103.605 166.981 101.552 164.928 99.0181 164.928C96.4847 164.928 94.431 166.981 94.431 169.515C94.431 172.048 96.4847 174.102 99.0181 174.102Z" fill="#A67A29"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M85.1358 174.003C87.6692 174.003 89.7229 171.95 89.7229 169.416C89.7229 166.883 87.6692 164.829 85.1358 164.829C82.6024 164.829 80.5487 166.883 80.5487 169.416C80.5487 171.95 82.6024 174.003 85.1358 174.003Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M82.6183 155.415C84.1383 155.415 85.3706 154.183 85.3706 152.663C85.3706 151.143 84.1383 149.91 82.6183 149.91C81.0983 149.91 79.866 151.143 79.866 152.663C79.866 154.183 81.0983 155.415 82.6183 155.415Z" fill="#BF8B2A"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M86.8757 144.896C88.3957 144.896 89.628 143.664 89.628 142.144C89.628 140.624 88.3957 139.391 86.8757 139.391C85.3557 139.391 84.1234 140.624 84.1234 142.144C84.1234 143.664 85.3557 144.896 86.8757 144.896Z" fill="#A67A29"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M83.7821 153.726C85.3021 153.726 86.5344 152.493 86.5344 150.973C86.5344 149.453 85.3021 148.221 83.7821 148.221C82.2621 148.221 81.0298 149.453 81.0298 150.973C81.0298 152.493 82.2621 153.726 83.7821 153.726Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M88.0395 143.207C89.5595 143.207 90.7918 141.974 90.7918 140.454C90.7918 138.934 89.5595 137.702 88.0395 137.702C86.5195 137.702 85.2872 138.934 85.2872 140.454C85.2872 141.974 86.5195 143.207 88.0395 143.207Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M100.31 171.504C102.843 171.504 104.897 169.45 104.897 166.917C104.897 164.383 102.843 162.33 100.31 162.33C97.7767 162.33 95.7229 164.383 95.7229 166.917C95.7229 169.45 97.7767 171.504 100.31 171.504Z" stroke="black" strokeWidth="2.75227"/>
                        <path d="M67.6523 168.863C67.6523 168.863 67.6341 169.779 68.5117 171.647C69.3894 173.515 71.5079 175.523 71.5079 175.523" stroke="black" strokeWidth="2.75227" strokeLinecap="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M21.5483 119.354C21.5483 119.354 5.76344 176.092 18.2987 183.799C30.8339 191.505 69.6285 162.551 77.1279 159.357C84.6274 156.163 89.9071 158.231 93.139 154.632C96.3709 151.033 96.9329 144.559 91.7449 143.08C86.557 141.602 84.8172 142.546 75.1782 149.512C65.5393 156.478 39.7602 165.73 35.5218 164.829C31.2834 163.928 41.7165 116.053 41.7165 116.053L21.5483 119.354Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M32.7381 86.2209C41.31 78.2524 49.2495 85.05 50.0012 93.7284C50.7529 102.407 45.5096 116.92 44.9007 117.724C44.2919 118.528 18.6594 120.097 18.1003 119.978C17.5412 119.859 24.1661 94.1893 32.7381 86.2209Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M112.367 105.004C117.129 104.687 123.434 100.166 124.61 96.8314C125.786 93.4968 121.568 88.7706 118.006 89.0079C114.444 89.2453 111.687 94.6324 110.582 97.7661C109.478 100.9 107.605 105.322 112.367 105.004Z" fill="#F8F8F8" stroke="#0C0C0C" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M101.69 101.167C103.672 101.588 105.621 100.323 106.042 98.3401C106.464 96.3577 105.198 94.409 103.216 93.9876C101.233 93.5663 99.2848 94.8317 98.8634 96.8142C98.4421 98.7966 99.7075 100.745 101.69 101.167Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M157.808 330.779C155.71 330.935 155.265 333.415 153.576 334.17C149.681 335.912 145.384 336.488 143.308 335.437C140.333 333.93 139.691 347.449 141.144 348.41C142.596 349.372 154.633 350.543 161.544 351.114C168.455 351.686 181.883 352.188 184.324 352.519C186.764 352.85 187.37 343.185 184.324 340.184C181.278 337.183 168.213 339.05 163.432 337.016C158.652 334.983 164.746 330.262 157.808 330.779Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M102.581 320.255C100.627 319.476 99.1394 321.509 97.2906 321.448C93.0265 321.306 88.9111 319.94 87.5066 318.085C85.4931 315.427 78.9898 327.296 79.8741 328.797C80.7583 330.298 91.0633 336.627 97.024 340.17C102.985 343.714 114.835 350.051 116.883 351.419C118.931 352.786 123.712 344.365 122.29 340.332C120.868 336.3 108.307 332.25 104.902 328.327C101.497 324.404 109.043 322.832 102.581 320.255Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                    </svg>
                </div>
                <div className="LoginGirl">
                    <svg width="279" height="456" viewBox="0 0 279 456" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M57.7166 341.222L60.1807 359.43H70.7688V338.478L57.7166 341.222Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M187.943 418.643L190.609 438.462L202.443 441.569V418.643H187.943Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M167.55 113.22C168.215 106.147 156.191 90.7468 149.642 106.21C143.092 121.674 128.668 169.496 128.668 169.496L70.9463 174.414C70.9463 174.414 71.6242 184.598 73.5503 186.504C75.4763 188.409 142.43 182.88 142.43 182.88C142.43 182.88 166.885 120.293 167.55 113.22Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M182.325 85.5266C202.696 71.9047 217.405 211.387 217.405 217.324C217.405 223.26 128.273 206.758 128.273 206.758C128.273 206.758 154.086 101.063 157.763 95.3286C161.441 89.5938 161.954 99.1485 182.325 85.5266Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M72.1226 343.711L55.9371 343.712C38.1765 298.74 36.5752 266.385 43.932 252.874C51.2888 239.363 149.441 203.908 149.441 203.908L200.537 222.506C180.911 271.004 74.8323 273.654 72.8288 275.296C70.8253 276.937 75.5793 301.89 72.1226 343.711Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M209.116 421.697L184.562 417.641C176.3 385.045 140.917 245.838 150.915 192.996L202.085 211.621C216.195 257.587 201.843 388.971 209.116 421.697Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M118.362 150.833C95.2437 150.833 88.2246 193.872 101.127 204.506C114.029 215.14 126.084 206.706 132.725 210.092C139.367 213.478 146.79 237.329 165.081 235.828C183.372 234.327 194.846 227.084 200.784 204.506C206.722 181.927 197.936 162.46 186.655 153.795C175.374 145.13 153.014 162.137 144.409 161.205C135.804 160.274 129.407 150.102 118.362 150.833Z" fill="#F8F8F8"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M122.949 155.42C99.8308 155.42 92.8117 198.459 105.714 209.093C118.616 219.727 130.671 211.293 137.313 214.679C143.954 218.065 151.377 241.916 169.668 240.415C187.959 238.914 199.433 231.671 205.371 209.093C211.309 186.514 202.523 167.047 191.242 158.382C179.961 149.718 157.601 166.724 148.996 165.792C140.391 164.861 133.994 154.689 122.949 155.42Z" fill="#F7B844"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M118.362 150.833C95.2437 150.833 88.2246 193.872 101.127 204.506C114.029 215.14 126.084 206.706 132.725 210.092C139.367 213.478 146.79 237.329 165.081 235.828C183.372 234.327 194.846 227.084 200.784 204.506C206.722 181.927 197.936 162.46 186.655 153.795C175.374 145.13 153.014 162.137 144.409 161.205C135.804 160.274 129.407 150.102 118.362 150.833Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M138.76 202.171C131.16 202.171 124.999 196.009 124.999 188.409C124.999 180.809 131.16 174.648 138.76 174.648C146.36 174.648 152.521 180.809 152.521 188.409C152.521 196.009 146.36 202.171 138.76 202.171Z" fill="#AB781C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M136.925 199.418C129.325 199.418 123.164 193.257 123.164 185.657C123.164 178.057 129.325 171.896 136.925 171.896C144.525 171.896 150.687 178.057 150.687 185.657C150.687 193.257 144.525 199.418 136.925 199.418Z" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M169.089 200.786C167.937 200.786 34.8939 163.8 32.0587 163.305C29.2234 162.81 6.80794 161.577 4.01425 158.908C1.22058 156.24 4.48294 140.703 9.1832 140.703C13.8835 140.703 30.3938 149.278 37.8972 152.39C45.4006 155.502 169.067 191.056 171.051 192.081C173.034 193.106 170.242 200.786 169.089 200.786Z" fill="#6A480C"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M170.007 200.786C168.854 200.786 33.9765 162.882 31.1412 162.387C28.306 161.892 5.89051 160.659 3.09683 157.991C0.303152 155.322 3.56551 139.786 8.26577 139.786C12.966 139.786 29.4764 148.361 36.9798 151.473C44.4832 154.585 169.985 191.056 171.968 192.081C173.952 193.106 171.16 200.786 170.007 200.786Z" stroke="black" strokeWidth="2.75227"/>
                        <path d="M186.031 217.324C186.031 217.324 184.349 220.46 182.419 222.101C180.489 223.743 178.618 224.254 178.618 224.254" stroke="black" strokeWidth="2.75227" strokeLinecap="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M155.438 76.9414L159.959 95.0729C159.959 95.0729 171.103 97.5369 174.966 95.8031C178.828 94.0693 182.007 85.1758 182.007 85.1758L168.324 67.0864C168.324 67.0864 172.034 41.2954 162.679 31.9838C153.324 22.6721 133.812 22.0911 126.627 38.3084C119.443 54.5256 132.684 80.5189 134.659 85.4354C136.634 90.3519 155.438 76.9414 155.438 76.9414Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M157.674 48.6923C157.674 48.6923 160.922 43.7039 163.572 47.7582C166.222 51.8125 163.01 58.2924 163.01 58.2924C163.01 58.2924 165.916 66.0742 169.402 65.5222C172.887 64.9702 174.398 58.7398 174.372 57.4282C174.022 39.6644 171.388 34.7343 170.498 32.9663C168.96 29.9132 163.267 24.9733 166.333 25.5015C169.399 26.0298 174.983 25.9133 178.553 32.9673C182.123 40.0214 184.04 58.2104 187.141 62.7126C190.241 67.2149 192.854 69.3873 198.133 68.7614C203.411 68.1355 210.602 61.6165 209.158 60.1019C207.714 58.5873 199.222 60.1456 195.063 54.2647C190.904 48.3838 201.063 35.3713 192.985 22.2942C184.221 8.10605 173.331 5.44619 164.335 8.56366C155.34 11.6811 159.318 20.9001 159.444 21.6985C159.571 22.4969 143.878 19.1072 131.362 26.3866C128.186 28.234 123.409 33.6005 122.414 39.3097C122.053 41.3834 121.353 47.9537 123.783 47.955C126.214 47.9564 137.041 39.3589 144.538 39.7064C152.035 40.0538 157.674 48.6923 157.674 48.6923Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M158.47 184.74C158.47 184.74 136.925 184.74 134.306 186.946C131.687 189.153 145.048 187.087 145.048 190.802C145.048 194.517 132.951 197.6 131.821 200.24C130.691 202.881 127.436 209.257 138.668 205.709C149.9 202.16 161.441 189.327 161.441 189.327L158.47 184.74Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M181.677 107.782C182.058 97.4477 192.528 85.2337 199.919 98.9745C207.309 112.715 217.404 163.885 217.404 172.58C217.404 181.274 159.718 196.971 158.943 195.18C158.167 193.389 156.4 190.244 155.131 184.724C153.862 179.203 197.663 167.804 197.663 160.217C197.663 152.63 181.297 118.117 181.677 107.782Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M52.3309 180.586C47.1894 175.661 49.8815 165.825 52.3309 162.832C54.7803 159.838 58.8046 162.391 62.2503 165.099C65.696 167.808 62.954 172.48 64.609 174.648C66.2641 176.816 70.9455 176.49 70.9455 176.49L73.4036 185.657C73.4036 185.657 57.4724 185.512 52.3309 180.586Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M187.943 434.414C190.041 434.57 190.487 437.05 192.175 437.805C196.07 439.547 200.368 440.123 202.443 439.072C205.418 437.565 206.06 449.25 204.607 450.211C203.155 451.172 191.118 452.343 184.207 452.915C177.296 453.487 166.62 453.988 164.18 454.319C161.74 454.651 161.134 446.82 164.18 443.819C167.226 440.819 177.539 442.685 182.319 440.652C187.099 438.618 181.005 433.897 187.943 434.414Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M57.1058 354.165C59.2089 354.101 59.911 356.52 61.6693 357.095C65.7247 358.42 70.059 358.544 72.0132 357.282C74.8146 355.472 76.6742 367.025 75.33 368.133C73.9858 369.241 62.1377 371.663 55.3245 372.955C48.5112 374.246 37.9407 375.765 35.5484 376.349C33.1561 376.934 31.7351 369.209 34.4509 365.907C37.1666 362.604 47.6228 363.478 52.1643 360.956C56.7058 358.434 50.1521 354.376 57.1058 354.165Z" fill="#F8F8F8" stroke="black" strokeWidth="2.75227"/>
                    </svg>
                </div>
                <div className="LoginUpperBubble">
                    <svg width="323" height="340" viewBox="0 0 323 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M35.4818 42.3172C-2.02244 117.214 -1.03979 162.53 1.45977 189.037C3.95932 215.544 28.1647 219.846 54.1586 240.377C80.1525 260.908 67.44 282.22 93.8588 295.867C120.278 309.513 136.288 289.72 161.586 295.867C186.883 302.013 192.444 301.821 224.324 309.526C256.204 317.23 268.39 350.703 279.353 336.056C290.316 321.408 290.404 311.872 294.713 267.144C299.023 222.415 286.956 224.996 294.713 176.634C302.47 128.273 333.404 98.6235 319.171 80.8512C304.938 63.0788 251.551 106.436 232.198 98.5728C212.845 90.7101 237.683 57.2304 224.324 42.3172C210.964 27.404 201.849 46.8557 173.677 42.3172C145.504 37.7786 153.983 10.7148 127.268 12.97C100.554 15.2252 72.9861 -32.5792 35.4818 42.3172Z" fill="#C9C9C9" fillOpacity="0.186189"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M70.9866 250.836C70.0374 253.894 69.3828 250.836 65.3348 250.836C61.988 250.836 58.0299 256.788 61.2487 261.278C64.4674 265.769 68.4898 264.281 70.9866 262.288C72.7479 260.883 73.788 257.34 73.788 254.757C73.788 252.175 73.788 224.351 73.788 224.351C73.788 224.351 79.3188 226.554 80.5937 231.789C81.8686 237.023 80.0121 248.093 80.5937 249.98C81.1753 251.867 82.9296 245.833 83.9172 242.571C84.9048 239.308 85.7953 233.127 82.5589 229.279C79.3226 225.432 71.6946 215.205 70.9866 216.651C70.2785 218.097 73.222 243.637 70.9866 250.836Z" fill="#F7B844" fillOpacity="0.553376"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M232.453 210.47C231.504 213.527 230.849 210.47 226.801 210.47C223.454 210.47 219.496 216.421 222.715 220.912C225.934 225.402 229.956 223.914 232.453 221.922C234.214 220.516 235.254 216.973 235.254 214.391C235.254 211.808 235.254 183.984 235.254 183.984C235.254 183.984 240.785 186.187 242.06 191.422C243.335 196.657 241.478 207.727 242.06 209.613C242.642 211.5 244.396 205.467 245.384 202.204C246.371 198.941 247.262 192.76 244.025 188.913C240.789 185.065 233.161 174.838 232.453 176.284C231.745 177.73 234.688 203.27 232.453 210.47Z" fill="#303D8B" fillOpacity="0.553376"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M193.921 54.508C192.972 57.5652 192.317 54.508 188.269 54.508C184.923 54.508 180.965 60.4591 184.183 64.9498C187.402 69.4404 191.424 67.9523 193.921 65.9599C195.682 64.5544 196.723 61.0111 196.723 58.4288C196.723 55.8464 196.723 28.0223 196.723 28.0223C196.723 28.0223 202.253 30.2256 203.528 35.4601C204.803 40.6947 202.947 51.7647 203.528 53.6515C204.11 55.5382 205.864 49.5047 206.852 46.2422C207.839 42.9797 208.73 36.7986 205.494 32.9509C202.257 29.1032 194.629 18.8761 193.921 20.3223C193.213 21.7685 196.157 47.3081 193.921 54.508Z" fill="#0A1658" fillOpacity="0.942171"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M38.8768 162.764C37.9276 165.821 37.273 162.764 33.2251 162.764C29.8783 162.764 25.9201 168.715 29.1389 173.206C32.3576 177.696 36.38 176.208 38.8768 174.216C40.6381 172.81 41.6782 169.267 41.6782 166.685C41.6782 164.102 41.6782 136.278 41.6782 136.278C41.6782 136.278 47.209 138.481 48.4839 143.716C49.7588 148.951 47.9023 160.021 48.4839 161.907C49.0655 163.794 50.8198 157.761 51.8074 154.498C52.7951 151.236 53.6855 145.054 50.4492 141.207C47.2128 137.359 39.5848 127.132 38.8768 128.578C38.1688 130.024 41.1122 155.564 38.8768 162.764Z" fill="#303D8B" fillOpacity="0.709654"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M115.149 202.23C114.189 205.294 113.527 202.23 109.432 202.23C106.047 202.23 102.043 208.194 105.299 212.694C108.555 217.194 112.624 215.703 115.149 213.706C116.931 212.298 117.983 208.747 117.983 206.159C117.983 203.571 117.857 173.437 117.857 173.437C117.857 173.437 115.35 167.251 114.634 168.701C114.561 168.848 115.042 168.518 115.036 169.122C114.985 174.446 117.18 195.75 115.149 202.23Z" fill="#303D8B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M95.8835 201.542C94.9233 204.606 94.2611 201.542 90.1663 201.542C86.7808 201.542 82.7769 207.506 86.0329 212.006C89.2889 216.506 93.3578 215.015 95.8835 213.018C97.6651 211.61 98.7173 208.059 98.7173 205.471C98.7173 202.883 98.7173 175 98.7173 175C98.7173 175 114.164 170.645 115.453 175.89C116.743 181.136 119.621 172.673 116.347 168.817C113.074 164.962 96.5997 165.835 95.8835 167.284C95.1673 168.733 98.1448 194.327 95.8835 201.542Z" fill="#303D8B"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M235.331 111.405C234.371 114.469 233.709 111.405 229.614 111.405C226.229 111.405 222.225 117.369 225.481 121.869C228.737 126.369 232.806 124.878 235.331 122.881C237.113 121.473 238.165 117.922 238.165 115.334C238.165 112.746 238.039 82.612 238.039 82.612C238.039 82.612 235.532 76.4263 234.816 77.8756C234.743 78.0232 235.224 77.6932 235.218 78.2973C235.167 83.6214 237.362 104.925 235.331 111.405Z" fill="#F7B844"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M216.066 110.717C215.106 113.781 214.443 110.717 210.349 110.717C206.963 110.717 202.959 116.681 206.215 121.181C209.471 125.681 213.54 124.19 216.066 122.193C217.847 120.785 218.9 117.234 218.9 114.646C218.9 112.058 218.9 84.1754 218.9 84.1754C218.9 84.1754 234.346 79.82 235.636 85.0656C236.925 90.3112 239.803 81.8485 236.53 77.9926C233.256 74.1368 216.782 75.0099 216.066 76.4591C215.35 77.9084 218.327 103.502 216.066 110.717Z" fill="#F7B844"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M301.386 161.864C300.426 164.927 299.764 161.864 295.669 161.864C292.284 161.864 288.28 167.827 291.536 172.328C294.792 176.828 298.861 175.336 301.386 173.34C303.168 171.931 304.22 168.381 304.22 165.793C304.22 163.205 304.094 133.07 304.094 133.07C304.094 133.07 301.588 126.885 300.871 128.334C300.798 128.482 301.279 128.152 301.273 128.756C301.223 134.08 303.417 155.384 301.386 161.864Z" fill="#8EACCD"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M282.12 161.175C281.16 164.239 280.498 161.175 276.403 161.175C273.018 161.175 269.014 167.139 272.27 171.639C275.526 176.139 279.595 174.648 282.12 172.652C283.902 171.243 284.954 167.692 284.954 165.105C284.954 162.517 284.954 134.634 284.954 134.634C284.954 134.634 300.4 130.278 301.69 135.524C302.98 140.769 305.858 132.307 302.584 128.451C299.31 124.595 282.836 125.468 282.12 126.917C281.404 128.367 284.382 153.96 282.12 161.175Z" fill="#8EACCD"/>
                    </svg>
                </div>
                <div className="LoginLines">
                    <svg width="1440" height="475" viewBox="0 0 1440 475" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-45 307.997C-45 307.997 111.598 325.354 192.483 307.997C282.933 288.587 358.026 221.614 477.826 195.76C617.65 165.585 706.902 208.526 784.024 192.997C930.58 163.486 941.626 82.631 1088.31 35.4522C1233.75 -11.3256 1392.58 -0.433041 1443 16.5845" stroke="black" strokeWidth="3"/>
                        <path d="M-45 370.993C59.4076 382.564 172.447 382.564 226.375 370.993C316.834 351.583 391.932 284.61 511.743 258.756C651.579 228.582 740.838 271.523 817.968 255.993C964.536 226.483 975.582 145.628 1122.28 98.4487C1267.74 51.6709 1426.58 62.5635 1477 79.581" stroke="black" strokeWidth="3"/>
                        <path d="M1 423.993C1 423.993 174.703 441.35 255.642 423.993C346.154 404.583 421.296 337.61 541.177 311.757C681.096 281.582 770.407 324.523 847.581 308.993C994.236 279.483 1005.29 198.628 1152.07 151.449C1297.61 104.671 1456.55 115.564 1507 132.581" stroke="black" strokeWidth="3"/>
                        <path d="M-3 463.993C-3 463.993 207.598 482.35 288.483 464.993C378.933 445.583 454.026 378.61 573.826 352.757C713.65 322.582 802.902 365.523 880.024 349.993C1026.58 320.483 1037.63 239.628 1184.31 192.449C1329.75 145.671 1488.58 156.564 1539 173.581" stroke="black" strokeWidth="3"/>
                        <path d="M1 493.993C1 493.993 211.598 512.35 292.483 494.993C382.933 475.583 458.026 408.61 577.826 382.757C717.65 352.582 806.902 395.523 884.024 379.993C1030.58 350.483 1041.63 269.628 1188.31 222.449C1333.75 175.671 1492.58 186.564 1543 203.581" stroke="black" strokeWidth="3"/>
                    </svg>
                </div>
            </div>

        )
    }
}

export default LoginImages;