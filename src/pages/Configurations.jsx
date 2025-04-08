import FixingBugs from '../assets/fixing-bugs.svg';
import GdriveConfig from '../components/Gdrive';
import SMTPConfiguration from '../components/SmtpConfig.';

const Configurations = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center">
               
                
                {/* Configuration Cards Container */}
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                     
                        
                        <SMTPConfiguration />
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                     
                        
                     <GdriveConfig />
                 </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Configurations;