// @ts-nocheck
"use client";
import { FileUploader } from "@/components/home/fileUploader";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import axios from "axios";
import * as XLSX from "xlsx";
import isAuth from "@/components/isAuth";
import DataTable from "react-data-table-component";
import { Loading } from "@/components/icons/loading";
import React from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const presignedUrl = useAuthStore((state) => state.presignedUrl);
  useEffect(() => {
    const decoded = jwtDecode(token?.id_token);
    const { email } = decoded ?? {};
    useAuthStore.setState({
      user: {
        name: email?.split("@")[0],
        email,
      },
    });
  }, [token]);

  const fetchPresignedUrl = async () => {
    let config = {
      timeout: 60000,
      url: "/api/user/url",
      method: "post",
      headers: {
        Authorization: `${token?.token_type} ${token?.access_token}`,
      },
    };

    try {
      const response = await axios.request(config);
      if (response?.status === 200) {
        useAuthStore.setState({
          presignedUrl: response?.data?.url,
        });
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const uploadToS3 = async (e: ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.target);

    const file = formData.get("file");

    if (!file) {
      return null;
    }

    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    readExcel(file);
  };

  const readExcel = (file: File) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, {
          type: "buffer",
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        console.log(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setItems(d);
    });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    await uploadToS3(e);
  };

  const onCellClicked = async (clickedRow, index) => {
    setClickedIndex(index);
    const rowItems = (await generateEmail(clickedRow)) ?? [];
    const rowData = rowItems.find(
      (rowItem) => rowItem.email === clickedRow.email
    );
    const { emailSubject, emailContent, email } = rowData ?? {};
    let config = {
      timeout: 60000,
      url: "/api/user/email/sent",
      method: "post",
      headers: {
        Authorization: `${token?.token_type} ${token?.access_token}`,
      },
      data: JSON.stringify({
        email,
        emailSubject,
        emailContent,
        senderEmail: user?.email,
      }),
    };

    try {
      setIsLoading(true);
      const response = await axios.request(config);
      console.log("response email sent", response);
      setIsLoading(false);
      setClickedIndex(null);
    } catch (error) {
      setIsLoading(false);
      setClickedIndex(null);
      return null;
    }
  };

  const columns = [
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row, index) => {
        return (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            onClick={() => onCellClicked(row, index)}
          >
            {isLoading && clickedIndex === index ? <Loading /> : "Sent"}
          </button>
        );
      },
      ignoreRowClick: true,
      allowoverflow: true,
      button: true,
    },
  ];

  const ExpandedComponent = ({ data }) => {
    const expandedRowItem = items.find(
      (rowItem) => rowItem.email === data.email
    );
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center pt-4">
          <Loading />
        </div>
      );
    }
    return (
      <div className="mt-4">
        <h2 className="text-xs">{expandedRowItem?.emailSubject}</h2>
        <br />
        {expandedRowItem?.emailContent
          ?.split("<br><br>")
          ?.map((emailSub, key) => {
            if (emailSub?.includes("<br>")) {
              return emailSub?.split("<br>")?.map((subPara, key) => (
                <p key={key} className="text-xs">
                  {subPara}
                </p>
              ));
            } else {
              return (
                <div key={key}>
                  <p className="text-xs">{emailSub}</p>
                  <br />
                </div>
              );
            }
          })}
      </div>
    );
  };

  const generateEmail = async (row) => {
    setIsLoading(true);
    const { email, name } = row;
    let config = {
      timeout: 60000,
      url: "/api/user/email",
      method: "post",
      headers: {
        Authorization: `${token?.token_type} ${token?.access_token}`,
      },
      data: JSON.stringify({ email, clientName: name, senderName: user?.name }),
    };

    try {
      const response = await axios.request(config);
      setIsLoading(false);
      let rowItems = items.map((itemRow) => {
        if (itemRow.email === email) {
          return {
            ...itemRow,
            emailSubject: response.data.email_subject,
            emailContent: response.data.email_content,
          };
        } else {
          return itemRow;
        }
      });
      setItems(rowItems);
      return rowItems;
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };

  const onToggled = async (expanded, row) => {
    if (expanded) {
      await generateEmail(row);
    }
    return;
  };

  const onSelectedRowsChange = (state) => setSelectedRows(state.selectedRows);

  const contextActions = React.useMemo(() => {
    const handleAction = () => {
      selectedRows.forEach((selectedRow) => {
        onCellClicked(selectedRow, null);
      });
    };

    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
        onClick={handleAction}
      >
        {isLoading ? <Loading /> : "Sent"}
      </button>
    );
  }, [selectedRows, isLoading]);

  return (
    <>
      <main className="py-8">
        <FileUploader
          handleFileUpload={handleSubmit}
          getPresignedUrl={fetchPresignedUrl}
          user={user}
        />
      </main>
      <div className="ml-3 mr-6">
        <DataTable
          title="Company List"
          columns={columns}
          data={items}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandedComponent}
          selectableRows
          pagination
          onRowExpandToggled={onToggled}
          contextActions={contextActions}
          onSelectedRowsChange={onSelectedRowsChange}
        />
      </div>
    </>
  );
};

export default isAuth(Dashboard);
