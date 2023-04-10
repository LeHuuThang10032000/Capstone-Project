@extends('layouts.app')

@section('title', 'Danh sách cửa hàng')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-0 overflow-hidden">
        <div class="d-flex justify-content-between" style="background-color: #C7CEEA;">
            <p class="h5 mb-0 p-3">Danh sách cửa hàng</p>
        </div>
        <div class="tab-content" id="myTabContent">
            @foreach($stores as $index => $store)
            <div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
                <div class="rounded border d-flex">
                    <div class="p-3">
                        <img src="{{ $store->image }}" width="140px" height="140px" alt="">
                    </div>
                    <div class="p-3">
                        <b class="m-0">Tên cửa hàng: {{$store->name}}</b>
                        <p class="m-0">Chủ cửa hàng: {{$store->user->f_name ?? 'Tài khoản đã xóa'}}</p>
                        <p class="m-0">Số điện thoại: {{$store->phone}}</p>
                        <p class="m-0">Vị trí: {{$store->location}}</p>
                        <p class="m-0">Tổng đơn hàng: {{$store->orders_count}}</p>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        <div class="py-2 px-3">
        {{ $stores->links() }}
        </div>
    </div>
</div>

@endsection