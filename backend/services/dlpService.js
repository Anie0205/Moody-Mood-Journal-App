const { DlpServiceClient } = require('@google-cloud/dlp');

class DLPService {
    constructor() {
        this.dlpClient = new DlpServiceClient();
        this.projectId = process.env.GCP_PROJECT_ID || 'your-project-id';
    }

    // Detect sensitive information in text
    async detectSensitiveInfo(text, infoTypes = []) {
        try {
            const defaultInfoTypes = [
                'PERSON_NAME',
                'EMAIL_ADDRESS',
                'PHONE_NUMBER',
                'CREDIT_CARD_NUMBER',
                'INDIAN_PAN_NUMBER',
                'INDIAN_AADHAAR_NUMBER',
                'INDIAN_PASSPORT_NUMBER',
                'INDIAN_DRIVER_LICENSE_NUMBER',
                'LOCATION',
                'DATE_OF_BIRTH',
                'IP_ADDRESS',
                'MAC_ADDRESS'
            ];

            const request = {
                parent: `projects/${this.projectId}/locations/global`,
                inspectConfig: {
                    infoTypes: infoTypes.length > 0 ? infoTypes : defaultInfoTypes.map(type => ({ name: type })),
                    minLikelihood: 'POSSIBLE',
                    limits: {
                        maxFindingsPerItem: 100,
                    },
                    includeQuote: true,
                },
                item: {
                    value: text,
                },
            };

            const [response] = await this.dlpClient.inspectContent(request);
            return response.result;
        } catch (error) {
            console.error('DLP detection error:', error);
            return { findings: [] };
        }
    }

    // De-identify sensitive information
    async deidentifyContent(text, infoTypes = []) {
        try {
            const defaultInfoTypes = [
                'PERSON_NAME',
                'EMAIL_ADDRESS',
                'PHONE_NUMBER',
                'CREDIT_CARD_NUMBER',
                'INDIAN_PAN_NUMBER',
                'INDIAN_AADHAAR_NUMBER',
                'INDIAN_PASSPORT_NUMBER',
                'INDIAN_DRIVER_LICENSE_NUMBER',
                'LOCATION',
                'DATE_OF_BIRTH',
                'IP_ADDRESS'
            ];

            const request = {
                parent: `projects/${this.projectId}/locations/global`,
                deidentifyConfig: {
                    infoTypeTransformations: {
                        transformations: [
                            {
                                infoTypes: infoTypes.length > 0 ? infoTypes : defaultInfoTypes.map(type => ({ name: type })),
                                primitiveTransformation: {
                                    replaceWithInfoTypeConfig: {}
                                }
                            }
                        ]
                    }
                },
                item: {
                    value: text,
                },
            };

            const [response] = await this.dlpClient.deidentifyContent(request);
            return {
                deidentifiedContent: response.item.value,
                overview: response.overview
            };
        } catch (error) {
            console.error('DLP de-identification error:', error);
            return {
                deidentifiedContent: text,
                overview: { transformedBytes: 0 }
            };
        }
    }

    // Check if text contains sensitive information
    async hasSensitiveInfo(text) {
        try {
            const result = await this.detectSensitiveInfo(text);
            return result.findings && result.findings.length > 0;
        } catch (error) {
            console.error('DLP sensitivity check error:', error);
            return false;
        }
    }

    // Get sensitivity score (0-1, where 1 is most sensitive)
    async getSensitivityScore(text) {
        try {
            const result = await this.detectSensitiveInfo(text);
            if (!result.findings || result.findings.length === 0) {
                return 0;
            }

            // Calculate weighted sensitivity score
            let totalScore = 0;
            let totalWeight = 0;

            result.findings.forEach(finding => {
                const likelihood = finding.likelihood;
                const weight = this.getInfoTypeWeight(finding.infoType.name);
                
                const likelihoodScore = this.getLikelihoodScore(likelihood);
                totalScore += likelihoodScore * weight;
                totalWeight += weight;
            });

            return totalWeight > 0 ? Math.min(totalScore / totalWeight, 1) : 0;
        } catch (error) {
            console.error('DLP sensitivity scoring error:', error);
            return 0;
        }
    }

    // Get weight for different info types
    getInfoTypeWeight(infoType) {
        const weights = {
            'PERSON_NAME': 0.8,
            'EMAIL_ADDRESS': 0.6,
            'PHONE_NUMBER': 0.7,
            'CREDIT_CARD_NUMBER': 1.0,
            'INDIAN_PAN_NUMBER': 1.0,
            'INDIAN_AADHAAR_NUMBER': 1.0,
            'INDIAN_PASSPORT_NUMBER': 1.0,
            'INDIAN_DRIVER_LICENSE_NUMBER': 0.9,
            'LOCATION': 0.5,
            'DATE_OF_BIRTH': 0.8,
            'IP_ADDRESS': 0.4,
            'MAC_ADDRESS': 0.3
        };
        return weights[infoType] || 0.5;
    }

    // Convert likelihood to numeric score
    getLikelihoodScore(likelihood) {
        const scores = {
            'VERY_UNLIKELY': 0.1,
            'UNLIKELY': 0.3,
            'POSSIBLE': 0.5,
            'LIKELY': 0.7,
            'VERY_LIKELY': 0.9
        };
        return scores[likelihood] || 0.5;
    }

    // Create custom info type for mental health sensitive content
    async createMentalHealthInfoType() {
        try {
            const request = {
                parent: `projects/${this.projectId}/locations/global`,
                infoType: {
                    name: 'MENTAL_HEALTH_SENSITIVE',
                    displayName: 'Mental Health Sensitive Content',
                    description: 'Content related to mental health conditions, treatments, and personal struggles'
                }
            };

            const [response] = await this.dlpClient.createStoredInfoType(request);
            return response;
        } catch (error) {
            console.error('Error creating mental health info type:', error);
            return null;
        }
    }

    // Detect mental health sensitive content
    async detectMentalHealthSensitive(text) {
        try {
            const mentalHealthKeywords = [
                'depression', 'anxiety', 'suicide', 'self-harm', 'therapy', 'medication',
                'psychiatrist', 'psychologist', 'mental illness', 'bipolar', 'PTSD',
                'trauma', 'abuse', 'addiction', 'substance', 'counseling', 'treatment'
            ];

            const lowerText = text.toLowerCase();
            const foundKeywords = mentalHealthKeywords.filter(keyword => 
                lowerText.includes(keyword.toLowerCase())
            );

            return {
                isSensitive: foundKeywords.length > 0,
                keywords: foundKeywords,
                sensitivityLevel: foundKeywords.length > 3 ? 'HIGH' : foundKeywords.length > 1 ? 'MEDIUM' : 'LOW'
            };
        } catch (error) {
            console.error('Mental health sensitivity detection error:', error);
            return { isSensitive: false, keywords: [], sensitivityLevel: 'LOW' };
        }
    }
}

module.exports = new DLPService();
