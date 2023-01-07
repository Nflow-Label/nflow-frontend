
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="footer footer-center p-4  text-base-content fixed bottom-0 ">
      <div className="flex lg:hidden m-auto">
        {/* <div className="btn-group">
          <button
            className="btn btn-primary no-animation"
            onClick={() => router.push("/")}
          >
            HOME
          </button>
          <button
            className="btn btn-primary no-animation"
            onClick={() => router.push("/pool")}
          >
            POOL
          </button>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
