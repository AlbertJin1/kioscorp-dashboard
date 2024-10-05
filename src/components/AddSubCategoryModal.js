import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';

const AddSubCategoryModal = ({ show, onHide, mainCategories, selectedMainCategory }) => {
    const [subCategoryName, setSubCategoryName] = useState('');
    const [selectedMainCategoryOption, setSelectedMainCategoryOption] = useState(null);

    const handleAddSubCategory = async () => {
        // API call to add sub category
        const res = await axios.post('http://localhost:8000/api/sub-categories/', {
            main_category: selectedMainCategoryOption.value,
            sub_category_name: subCategoryName,
        });
        console.log(res.data);
        onHide();
    };

    const handleMainCategoryChange = (option) => {
        setSelectedMainCategoryOption(option);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="modal-dialog modal-dialog-centered modal-lg"
        >
            <Modal.Header closeButton className="bg-blue-900 text-white">
                <Modal.Title id="contained-modal-title-vcenter" className="text-2xl">
                    Add Sub Category
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-blue-900 text-white">
                <div className="flex flex-col gap-4">
                    <Select
                        options={mainCategories.map((category) => ({
                            value: category.main_category_id,
                            label: category.main_category_name,
                        }))}
                        value={selectedMainCategoryOption}
                        onChange={handleMainCategoryChange}
                        placeholder="Select Main Category"
                        className="w-full bg-white text-black border border-black rounded py-2 px-4"
                    />
                    <input
                        type="text"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        placeholder="Enter Sub Category Name"
                        className="w-full bg-white text-black border border-black rounded py-2 px-4"
                    />
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-blue-900 text-white">
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddSubCategory}
                >
                    Add Sub Category
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddSubCategoryModal;