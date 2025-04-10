import GdriveConfig from '../components/Gdrive';
import SMTPConfiguration from '../components/SmtpConfig.';

const Configurations = () => {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col items-center text-center mb-10">

            </div>
            <div className="flex w-full justify-center mx-auto max-w-5xl gap-8">
                <SMTPConfiguration />
                <GdriveConfig />
            </div>
        </div>
    );
}

export default Configurations;