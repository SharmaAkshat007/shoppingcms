import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useEffect, useState } from "react";
import getAccessToken from "../utils/getAccessToken";
import Title from "./Title";
import { Order } from "../types/order";
import { Button, Typography } from "@mui/material";
import { primary } from "../utils/color";

export default function Orders() {
  const [orders, setOrders] = useState<Array<Order>>();

  const handleStatusChange = async (event: any) => {
    try {
      const access_token: string = await getAccessToken();
      const orderId = event.target.id as string;

      await fetch(
        `${process.env.REACT_APP_BASE_SERVER_URL_DEV}/api/v1/order/changeStatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${access_token}`,
          },
        }
      );

      const newOrder = orders?.map((order) => {
        if (order.id === orderId) {
          order.status = true;
        }
        return order;
      });
      setOrders(newOrder);
    } catch (err: any) {
      console.log(err.response);
    }
  };

  const getMyOrders = async () => {
    try {
      const access_token: string = await getAccessToken();

      const res = await axios.get(
        `${process.env.REACT_APP_BASE_SERVER_URL_DEV}/api/v1/order/my`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );

      const currOrders: Array<Order> = res.data.data.map((order: Order) => {
        return order as Order;
      });
      setOrders(currOrders);
    } catch (err) {}
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ color: primary }}>
          Recent Orders
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: primary }}>Product Name</TableCell>
              <TableCell sx={{ color: primary }}> Buyer Name</TableCell>
              <TableCell sx={{ color: primary }}>Ship To</TableCell>
              <TableCell sx={{ color: primary }}>Mobile No.</TableCell>
              <TableCell sx={{ color: primary }}>Quantity</TableCell>
              <TableCell sx={{ color: primary }} align="right">
                Sale Amount
              </TableCell>
              <TableCell sx={{ color: primary }} align="right">
                Delivered
              </TableCell>
              <TableCell sx={{ color: primary }} align="right">
                Change Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.name}</TableCell>
                <TableCell>
                  {order.first_name + " " + order.last_name}
                </TableCell>
                <TableCell>
                  {order.address_line1 +
                    ", " +
                    order.address_line2 +
                    ", " +
                    order.city +
                    ", " +
                    order.state +
                    ", " +
                    order.pin_code}
                </TableCell>
                <TableCell>{order.mobile_no}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell align="right">{`₹${
                  order.price * order.quantity
                }`}</TableCell>
                <TableCell>{order.status ? "True" : "False"}</TableCell>
                <TableCell>
                  <Button
                    id={order.id}
                    size="small"
                    variant="contained"
                    disableElevation={true}
                    sx={{
                      backgroundColor: primary,
                      "&:hover": { backgroundColor: primary },
                    }}
                    onClick={handleStatusChange}
                  >
                    Delivered
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
