import groupPic from "../assets/group.png";

const FullOfSuite = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5">
            <img
                src={groupPic}
                alt="Group"
                className="w-[50vw] rounded-4xl shadow-lg mt-6"
            />
            <footer className="mt-6 text-sm text-gray-400 text-center">


                <p className="mt-2">Made with ❤️ by:
                    <a href="https://github.com/jzaragosa06" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">Null</a>•
                    <a href="https://github.com/TonYacapin" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">Anghel</a>•
                    <a href="https://github.com/Luckyyy28" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">Lucky</a>•
                    <a href="https://github.com/DarcMattz" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline mx-1">Bee</a>
                </p>
            </footer>
        </div>
    );
};

export default FullOfSuite;
