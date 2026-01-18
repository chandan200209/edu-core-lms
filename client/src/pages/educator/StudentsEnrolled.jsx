import React, { useContext, useEffect, useState } from 'react'
import { dummyDashboardData, dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/students/Loading';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

function StudentsEnrolled() {
    const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
    const [enrolledStudents, setEnrolledStudents] = useState(null);
    // const fetchEnrolledStudents = async () => {
    //     try {
    //         const token = await getToken();
    //         const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students', {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         if (data.success) {
    //             setEnrolledStudents(data.enrolledStudents.reverse());
    //         }
    //         else {
    //             toast.error(data.message);
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // };
    const fetchEnrolledStudents = async () => {
        setEnrolledStudents(dummyStudentEnrolled);
    };
    // useEffect(() => {
    //     if (isEducator) {
    //         fetchEnrolledStudents();
    //     }
    // }, [isEducator]);
    useEffect(() => {
        fetchEnrolledStudents();
    }, []);
    return enrolledStudents ? (
        <div className="flex flex-col justify-between items-start min-h-screen pb-0 md:pb-0 p-4 md:p-8 pt-8">
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
                    <thead className="text-gray-900 border-b border-gray-500/20 text-left text-sm">
                        <tr>
                            <td className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                                #
                            </td>
                            <td className="px-4 py-3 font-semibold ">Student Name</td>
                            <td className="px-4 py-3 font-semibold ">Course Title</td>
                            <td className="px-4 py-3 font-semibold hidden sm:table-cell">Date</td>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-500">
                        {enrolledStudents.map((item, index) => (
                            <tr className="border-b border-gray-500/20" key={index}>
                                <td className="px-4 py-3 text-center hidden sm:table-cell">
                                    {index + 1}
                                </td>
                                <td className="px-2 md:px-4 py-3 flex items-center space-x-3">
                                    <img
                                        src={item.student.imageUrl}
                                        className="w-9 h-9 rounded-full"
                                        alt=""
                                    />
                                    <span className="truncate">{item.student.name}</span>
                                </td>
                                <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                                <td className="px-4 py-3 hidden sm:table-cell">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <Loading />
    );
}

export default StudentsEnrolled
