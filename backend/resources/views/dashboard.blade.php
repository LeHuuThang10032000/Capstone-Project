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
            <div class="border-top d-flex justify-content-between">
                <p>Số đơn thành công</p>
                <p>{{ $orders->first()->taken_count }}</p>
            </div>
            <div class="border-top d-flex justify-content-between">
                <p>Số đơn đã hủy</p>
                <p>{{ $orders->first()->canceled_count }}</p>
            </div>
        </div>
        <div class="col rounded border m-1 p-2 bg-white">
            
        </div>
    </div>
</div>

@endsection