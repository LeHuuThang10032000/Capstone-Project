@extends('layouts.app')

@section('title', 'Trang chủ')

@section('content')

<div class="container">
    <div class="row">
        <div class="col rounded border m-1 p-2 bg-white">
            <div class="d-flex">
                <div class="p-2">
                    <img src="{{ asset('img/pending.png') }}" alt="">
                </div>
                <div class="p-2 w-100 text-end">
                    <p class="h5">Cửa hàng đang chờ xét duyệt</p>
                    <p class="h5">{{ $pendingStores }}</p>
                </div>
            </div>
        </div>
        <div class="col rounded border m-1 p-2 bg-white">
            <div class="d-flex">
                <div class="p-2">
                    <img src="{{ asset('img/restaurant.png') }}" alt="">
                </div>
                <div class="p-2 w-100 text-end">
                    <p class="h5">Cửa hàng đang hoạt động</p>
                    <p class="h5">{{ $approvedStores }}</p>
                </div>
            </div>
        </div>
        <div class="col rounded border m-1 p-2 bg-white">
            <div class="d-flex">
                <div class="p-2">
                    <img src="{{ asset('img/register.png') }}" alt="">
                </div>
                <div class="p-2 w-100 text-end">
                    <p class="h5">Người dùng đăng ký trong tháng</p>
                    <p class="h5">{{ $newRegisters }}</p>
                </div>
            </div>
        </div>
        <div class="col rounded border m-1 p-2 bg-white">
            <div class="d-flex">
                <div class="p-2">
                    <img src="{{ asset('img/transactional.png') }}" alt="">
                </div>
                <div class="p-2 w-100 text-end">
                    <p class="h5">Lượng giao dịch trong tháng</p>
                    <p class="h5">{{ $monthTransactions }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-4 rounded border m-1 p-2 bg-white">
            <p class="h5">Thống kê</p>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Tổng tiền ví</p>
                <p>{{ number_format($transactions->first()->wallet_total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Tổng tiền ví tín dụng</p>
                <p>{{ number_format($transactions->first()->credit_total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số đơn thành công</p>
                <p>{{ $orders->first()->taken_count }} đơn</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số đơn đã hủy</p>
                <p>{{ $orders->first()->canceled_count }} đơn</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Tổng tiền đơn hàng</p>
                <p>{{ number_format($orders->first()->total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Tổng tiền đã giao dịch</p>
                <p>{{ number_format($transactions->first()->transaction_total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số tiền đã rút</p>
                <p>{{ number_format($transactions->first()->withdraw_total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số tiền đã nạp</p>
                <p>{{ number_format($transactions->first()->deposit_total) }}đ</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số lượng người dùng</p>
                <p>{{ number_format($transactions->first()->user_total) }}</p>
            </div>
            <div class="border-top d-flex justify-content-between pt-1">
                <p>Số dư ví hệ thống</p>
                <p>{{ number_format($admin->wallet->balance) }}đ</p>
            </div>
            
        </div>
        <div class="col rounded border m-1 p-2 bg-white">
            <p class="h5">Giao dịch phát sinh gần đây</p>
            <table class="table">
                <thead style="background-color: #C7CEEA">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Mã giao dịch</th>
                        <th scope="col">Tên người chuyển</th>
                        <th scope="col">Tên người nhận</th>
                        <th scope="col">Số tiền</th>
                        <th scope="col">Thời gian phát sinh</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($transactions as $key => $transaction)
                    <tr>
                        <th scope="row">{{$key + 1}}</th>
                        <td>{{$transaction->code}}</td>
                        <td>{{$transaction->fromUser->f_name ?? 'Người dùng VLPay'}}</td>
                        <td>{{$transaction->toUser->f_name ?? 'Người dùng VLPay'}}</td>
                        <td>{{number_format($transaction->amount)}}đ</td>
                        <td>{{$transaction->created_at}}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection