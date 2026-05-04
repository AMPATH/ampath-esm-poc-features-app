import React, { useMemo, useState } from "react";
import styles from './user-feedback.component.scss';
import { Button, ComboBox, TextArea, TextInput } from "@carbon/react";
import { sendUserFeedback } from "./user-feedback.resource";
import { type createFeedbackMessageDto } from "./types";
import { showSnackbar, useSession } from "@openmrs/esm-framework";
interface UserFeedbackFormProps { }
const UserFeedbackForm: React.FC<UserFeedbackFormProps> = () => {
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const session = useSession();
    const currentUser = session.user;
    const location = session.sessionLocation;
    const handlePhoneNoChange = (phone: string) => {
        setPhoneNo(phone);
    };
    const departmentChangeHandler = (selectedDepartment: any) => {
        const d = selectedDepartment.selectedItem.id;
        setSelectedDepartment(d);
    };
    const messageChangeHandler = (message: string) => {
        setMessage(message);
    };
    const handleSendMessage = async () => {
        const createMessagePayload = generateFeedbackPayload();
        if (isValidFeeedbackDto(createMessagePayload)) {
            const resp = await sendUserFeedback(createMessagePayload);
            if (resp) {
                showSnackbar({
                    kind: 'success',
                    title: 'Feedback Sent',
                    subtitle: 'Feedback succesfully sent. Someone from the team will reach out. Please be patient.'
                });

                resetFormValues();
            }
        }


    };
    const generateFeedbackPayload = (): createFeedbackMessageDto => {
        return {
            name: currentUser?.person.display ?? '',
            phone: phoneNo,
            message: message,
            department: selectedDepartment,
            location: location?.display ?? ''
        }
    };
    const isValidFeeedbackDto = (createFeedbackMessageDto: createFeedbackMessageDto): boolean => {
        if (!createFeedbackMessageDto.name) {
            showSnackbar({
                kind: 'error',
                title: 'Invalid Input',
                subtitle: 'Missing Name'
            });
            return false;
        }
        if (!createFeedbackMessageDto.phone) {
            showSnackbar({
                kind: 'error',
                title: 'Invalid Input',
                subtitle: 'Missing Phone Number'
            });
            return false;
        }
        if (!createFeedbackMessageDto.message) {
            showSnackbar({
                kind: 'error',
                title: 'Invalid Input',
                subtitle: 'Missing Message'
            });
            return false;
        }
        if (!createFeedbackMessageDto.department) {
            showSnackbar({
                kind: 'error',
                title: 'Invalid Input',
                subtitle: 'Please select a department'
            });
            return false;
        }
        if (!createFeedbackMessageDto.location) {
            showSnackbar({
                kind: 'error',
                title: 'Invalid Input',
                subtitle: 'Missing user location'
            });
            return false;
        }
        return true;
    }

    const resetFormValues = ()=>{
        setPhoneNo('');
        setMessage('');
        setSelectedDepartment('');
    }

    const departmentOptions = [
        {
            text: 'HIV',
            id: 'HIV',
        },
        {
            text: 'HEMATO-ONCOLOGY',
            id: 'HEMATO-ONCOLOGY',
        },
        {
            text: 'CDM',
            id: 'CDM',
        },
        {
            text: 'BSG',
            id: 'BSG',
        },
        {
            text: 'DERMATOLOGY',
            id: 'DERMATOLOGY',
        },
        {
            text: 'MNCH',
            id: 'MNCH',
        },
        {
            text: 'HTS',
            id: 'HTS',
        },
        {
            text: 'KVP',
            id: 'KVP',
        },
    ];
    return <>
        <div className={styles.userFeedbackFormLayout}>
            <div className={styles.formHeader}>
                <h4>Got something to say? Feel free to talk to us</h4>
            </div>
            <div className={styles.formContent}>

                <div className={styles.formRow}>
                    <TextInput
                        className="input-test-class"
                        defaultValue=""
                        id="text-input-1"
                        labelText="Phone Number"
                        onChange={(e) => handlePhoneNoChange(e.target.value)}
                        placeholder="072..."
                        size="md"
                        type="text"
                    />
                </div>
                <div className={styles.formRow}>
                    <ComboBox
                        onChange={departmentChangeHandler}
                        id="department-combobox"
                        items={departmentOptions}
                        itemToString={(item) => (item ? item.text : '')}
                        titleText="Select Department"
                    />
                </div>
                <div className={styles.formRow}>
                    <TextArea
                        enableCounter
                        id="message"
                        labelText="Message"
                        maxCount={500}
                        placeholder=""
                        rows={4}
                        onChange={(e) => messageChangeHandler(e.target.value)}
                    />
                </div>

                <div className={styles.formRow}>
                    <Button kind="primary" onClick={handleSendMessage}>Send Message</Button>
                </div>

            </div>

        </div>
    </>
}
export default UserFeedbackForm;