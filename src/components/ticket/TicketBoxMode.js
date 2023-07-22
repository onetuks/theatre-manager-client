import React, {useEffect, useState} from 'react';
import {PerformanceList} from "../theatre/PerformanceList";
import axios from "axios";
import {Mode} from "../vo/Mode";
import {Order} from "./Order";

export function TicketBoxMode() {
    const [performances, setPerformances] = useState([]);
    const [tickets, setTickets] = useState([]);

    const handleAddClicked = (performanceId, reservedDate) => {
        const performance = performances.find(performance => performance.performanceId === performanceId);
        const newTicket = {
            performance: performance,
            reservedDate: reservedDate
        }
        setTickets([...tickets, newTicket]);
    };

    const handleTicketRemove = (index) => {
        setTickets(tickets.filter((v, i) => i !== index));
    };

    const handleSubmit = (email) => {
        if (tickets.length === 0) {
            alert("티켓을 추가해주세요!");
        } else {
            axios.post("http://localhost:8080/api/v1/ticket-orders/create", {
                email: email,
                tickets: tickets.map(ticket => ({
                    performanceId: ticket.performance.performanceId,
                    ticketPrice: ticket.performance.price,
                    reservedDate: ticket.reservedDate
                }))
            }).then(
                res => alert("예매가 정상적으로 처리되었습니다."),
                err => {
                    alert("예매가 처리되지 않았습니다. - 서버 에러");
                    console.error(err);
                }
            )
        }
    };

    useEffect(() => {
        axios.get("http://localhost:8080/api/v1/performances")
            .then(r => setPerformances(r.data))
            .catch(e => console.error(e));
    }, []);

    return (
        <>
            <div className="col-md-8 mt-4 d-flex flex-column align-items-start p-3 pt-0">
                <PerformanceList performances={performances} mode={Mode.TICKET_MODE}
                                 onClickEventHandler={handleAddClicked}/>
            </div>
            <div className="col-md-4 summary p-4">
                <Order tickets={tickets} onTicketOrderSubmit={handleSubmit} onTicketRemoveHandler={handleTicketRemove}/>
            </div>
        </>
    );
}