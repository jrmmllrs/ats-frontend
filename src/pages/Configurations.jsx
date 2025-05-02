import { useState, useEffect } from 'react';
import GdriveConfig from '../components/Gdrive';
import SMTPConfiguration from '../components/SmtpConfig.';
import api from '../services/api';
import useUserStore from '../context/userStore';
import Loader from '../components/Loader';

const Configurations = () => {
    const [hasGdriveConfig, setHasGdriveConfig] = useState(false);
    const [hasSmtpConfig, setHasSmtpConfig] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, hasFeature } = useUserStore();

    const canSMTPConfiguration = hasFeature("SMTP Configuration");
    const canGoogleDriveConfiguration = hasFeature("Google Drive Configuration");

    useEffect(() => {
        const checkConfigurations = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const companyId = user.company_id;
                const userId = user.user_id;

                // Check Google Drive configuration
                try {
                    const gdriveResponse = await api.get(`/user-configuration/gdrive/get-credentials/${companyId}`);
                    setHasGdriveConfig(gdriveResponse.data === true);
                } catch (gdriveError) {
                    setHasGdriveConfig(false);
                }

                // Check SMTP configuration separately
                try {
                    const smtpResponse = await api.get(`/user-configuration/smtp/get-credentials/${userId}`);
                    setHasSmtpConfig(smtpResponse.data === true);
                } catch (smtpError) {
                    setHasSmtpConfig(false);
                }
            } catch (error) {
                console.error("General error checking configurations:", error);
            } finally {
                setLoading(false);
            }
        };

        checkConfigurations();
    }, [user]);

    if (!user) {
        return <div className="text-center py-10">Please log in to view configurations</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader
                        type="spinner"
                        size="xl"
                        color="#008080"
                        text="Loading configurations..."
                        fullScreen={false}
                        className="mx-auto"
                        theme="teal"
                    />
                </div>
            ) : (
                <div className="flex w-full justify-center mx-auto max-w-5xl gap-8 flex-col md:flex-row">
                    {canSMTPConfiguration && (
                        <div className="w-full md:w-1/2">
                            {hasSmtpConfig && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700">
                                        You already have SMTP configurations. Proceeding will modify your existing settings.
                                    </p>
                                </div>
                            )}
                            <SMTPConfiguration />
                        </div>
                    )}

                    {canGoogleDriveConfiguration && (
                        <div className="w-full md:w-1/2">
                            {hasGdriveConfig && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                    <p className="text-yellow-700">
                                        You already have Google Drive configurations. Proceeding will modify your existing settings.
                                    </p>
                                </div>
                            )}
                            <GdriveConfig />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Configurations;