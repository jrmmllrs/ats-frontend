import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import random from "random";
import NotFoundImage1 from "../assets/404cuate.svg";
import NotFoundImage2 from "../assets/404bro.svg";
import NotFoundImage3 from "../assets/404amico.svg";
import NotFoundImage4 from "../assets/404pana.svg";
import NotFoundImage5 from "../assets/404rafiki.svg";


export default function NotFound() {

    const images = [
        NotFoundImage1,
        NotFoundImage2,
        NotFoundImage3,
        NotFoundImage4,
        NotFoundImage5
    ];
    const randomIndex = random.int(0, images.length - 1);
    const NotFoundImage = images[randomIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <img
                src={NotFoundImage}
                alt="404 Not Found"
                className="w-80 mb-8"
            />
            <p className="text-lg text-gray-600 mb-6">
                Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
            >
                <FaArrowLeft />
                Back to Dashboard
            </Link>
        </div>
    );
}
