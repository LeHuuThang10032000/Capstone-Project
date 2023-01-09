@extends('layouts.app')

@section('title', 'Ví')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <div class="d-flex justify-content-between">
            <h3 class="mb-0">Danh sách ví</h3>
        </div>

        <hr>
        <table class="table">
            <thead style="background-color: #C7CEEA">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Số điện thoại</th>
                    <th scope="col">Số dư ví</th>
                    <th scope="col">Hạn mức</th>
                    <th scope="col">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                @foreach($wallets as $key => $wallet)
                <tr>
                    <th scope="row">{{$key + 1}}</th>
                    <td>{{$wallet->user->phone}}</td>
                    <td>{{$wallet->balance}}</td>
                    <td>{{$wallet->credit_limit}}</td>
                    <td>{{$wallet->status}}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection