"use client";
import Reveal from "../Reveal";

export default function Features() {
    return (
        <section className="features py-5">
            <div className="container">
                <div className="row">
                    <Reveal className="col-md-3 text-center" animation="fade-in" delay={0}>
                        <div className="py-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M20 17q.86 0 1.45.6t.58 1.4L14 22l-7-2v-9h1.95l7.27 2.69q.78.31.78 1.12q0 .47-.34.82t-.86.37H13l-1.75-.67l-.33.94L13 17zM16 3.23Q17.06 2 18.7 2q1.36 0 2.3 1t1 2.3q0 1.03-1 2.46t-1.97 2.39T16 13q-2.08-1.89-3.06-2.85t-1.97-2.39T10 5.3q0-1.36.97-2.3t2.34-1q1.6 0 2.69 1.23M.984 11H5v11H.984z"
                                />
                            </svg>
                            <h4 className="element-title text-capitalize my-3">
                                Handmade with Love
                            </h4>
                            <p>
                                Every piece is unique, crafted by skilled artisans using
                                traditional methods. Quality and care in every stitch.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="col-md-3 text-center" animation="fade-in" delay={300}>
                        <div className="py-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill="currentColor"
                                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8s8-3.6 8-8s-3.6-8-8-8m5.2 5.3c.4 0 .7.3 1.1.3c-.3.4-1.6.4-2-.1c.3-.1.5-.2.9-.2M1 8c0-.4 0-.8.1-1.3c.1 0 .2.1.3.1c0 0 .1.1.1.2c0 .3.3.5.5.5c.8.1 1.1.8 1.8 1c.2.1.1.3 0 .5c-.6.8-.1 1.4.4 1.9c.5.4.5.8.6 1.4c0 .7.1 1.5.4 2.2C2.7 13.3 1 10.9 1 8m7 7c-.7 0-1.5-.1-2.1-.3q-.15-.3 0-.6c.4-.8.8-1.5 1.3-2.2c.2-.2.4-.4.4-.7c0-.2.1-.5.2-.7c.3-.5.2-.8-.2-.9c-.8-.2-1.2-.9-1.8-1.2s-1.2-.5-1.7-.2c-.2.1-.5.2-.5-.1c0-.4-.5-.7-.4-1.1c-.1 0-.2 0-.3.1s-.2.2-.4.1c-.2-.2-.1-.4-.1-.6c.1-.2.2-.3.4-.4c.4-.1.8-.1 1 .4c.3-.9.9-1.4 1.5-1.8c0 0 .8-.7.9-.7s.2.2.4.3c.2 0 .3 0 .3-.2c.1-.5-.2-1.1-.6-1.2c0-.1.1-.1.1-.1c.3-.1.7-.3.6-.6c0-.4-.4-.6-.8-.6c-.2 0-.4 0-.6.1c-.4.2-.9.4-1.5.4C5.2 1.4 6.6 1 8 1h.8c-.6.1-1.2.3-1.6.5c.6.1.7.4.5.9c-.1.2 0 .4.2.5s.4.1.5-.1c.2-.3.6-.4.9-.5c.4-.1.7-.3 1-.7c0-.1.1-.1.2-.2c.6.2 1.2.6 1.8 1c-.1 0-.1.1-.2.1c-.2.2-.5.3-.2.7c.1.2 0 .3-.1.4c-.2.1-.3 0-.4-.1s-.1-.3-.4-.3c-.1.2-.4.3-.4.6c.5 0 .4.4.5.7c-.6.1-.8.4-.5.9c.1.2-.1.3-.2.4c-.4.6-.8 1-.8 1.7s.5 1.4 1.3 1.3c.9-.1.9-.1 1.2.7c0 .1.1.2.1.3c.1.2.2.4.1.6c-.3.8.1 1.4.4 2c.1.2.2.3.3.4c-1.3 1.4-3 2.2-5 2.2"
                                />
                            </svg>
                            <h4 className="element-title text-capitalize my-3">
                                Sustainable & Ethical
                            </h4>
                            <p>
                                Made with natural, responsibly-sourced materials to minimize our
                                impact on the planet.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="col-md-3 text-center" animation="fade-in" delay={600}>
                        <div className="py-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                >
                                    <path d="m12.502 9.13l2.049.531c.264.069.45.309.441.582C14.826 15.232 12 16 12 16s-2.826-.768-2.992-5.757a.584.584 0 0 1 .441-.582l2.05-.53a2 2 0 0 1 1.003 0M2 8l9.732-4.866a.6.6 0 0 1 .536 0L22 8" />
                                    <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                                </g>
                            </svg>
                            <h4 className="element-title text-capitalize my-3">
                                Family & Pet Friendly
                            </h4>
                            <p>
                                Durable, non-toxic, and made to last. Safe for the ones you love
                                and designed for real life.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="col-md-3 text-center" animation="fade-in" delay={900}>
                        <div className="py-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="50"
                                height="50"
                                viewBox="0 0 16 16"
                            >
                                <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                                    <path d="m8.427 11.073l1.205-1.205a.4.4 0 0 0 .118-.285a.8.8 0 0 0-.236-.569L8.427 7.927a.603.603 0 0 0-.854 0L6.486 9.014a.8.8 0 0 0-.236.57c0 .106.042.208.118.284l1.205 1.205a.604.604 0 0 0 .854 0" />
                                    <path d="M16 5.796v-.028a1.768 1.768 0 0 0-3.018-1.25l-.76.76l-.024.024l-.374.374l-.415.415a.335.335 0 0 1-.561-.149l-.155-.566l-.139-.51l-.009-.033l-.65-2.386a1.964 1.964 0 0 0-3.79 0l-.65 2.386l-.01.032l-.139.511l-.154.566a.335.335 0 0 1-.56.15l-.416-.416l-.374-.374l-.024-.024l-.76-.76A1.768 1.768 0 0 0 0 5.768v.028q0 .203.046.403l1.3 5.631a1.4 1.4 0 0 0 .778.958a14.02 14.02 0 0 0 11.752 0c.394-.182.681-.535.779-.958l1.299-5.63q.045-.2.046-.404M3.53 7.152c.997.997 2.698.545 3.07-.815l.952-3.495a.464.464 0 0 1 .896 0L9.4 6.337c.37 1.36 2.072 1.812 3.068.815l1.574-1.574a.268.268 0 0 1 .457.19v.028a.3.3 0 0 1-.008.066l-1.288 5.584a12.52 12.52 0 0 1-10.408 0L1.508 5.862a.3.3 0 0 1-.008-.066v-.028a.268.268 0 0 1 .457-.19z" />
                                </g>
                            </svg>
                            <h4 className="element-title text-capitalize my-3">
                                Luxurious Quality
                            </h4>
                            <p>
                                Experience the finest materials and superior finishes that add a
                                touch of everyday luxury to your home.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
