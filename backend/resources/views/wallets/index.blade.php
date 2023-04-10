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
                    <th scope="col">Hạn mức tín dụng</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                @foreach($wallets as $key => $wallet)
                <tr>
                    <th scope="row">{{$key + 1}}</th>
                    <td>{{$wallet->user->phone ?? null}}</td>
                    <td>{{number_format($wallet->balance ?? null)}} VND</td>
                    <td>{{number_format($wallet->credit_limit ?? null)}} VND</td>
                    <td>
                        <form action="{{ route('organiser.wallet.activate', $wallet->id) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <button class="px-1 rounded {{ ($wallet->status == 'active') ? 'btn-theme-warning' : 'btn-theme' }}">{{ ($wallet->status == 'active') ? 'Vô hiệu hóa' : 'Hoạt động' }}</button>
                        </form>
                    </td>
                    <td>
                        <button type="button" class="px-2 rounded btn-theme" data-bs-toggle="modal" data-bs-target="#modal{{$wallet->id}}">Nạp tiền</button>

                        <div class="modal fade" id="modal{{$wallet->id}}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

                            <form action="{{route('organiser.wallet.deposit', $wallet->id)}}" method="POST">
                                @csrf
                                @method('PUT')
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <p>Số tiền:</p>
                                            <input type="number" class="form-control" name="amount" required max="10000000" min="1000" oninvalid="alert('Số tiền nhập vào không được vượt quá 10.000.000 VND');">
                                        </div>
                                        <div class="modal-footer">
                                            <button type="submit" class="btn btn-theme px-4">Xác nhận</button>
                                            <button type="button" class="btn btn-theme-cancel px-4" data-bs-dismiss="modal">Hủy</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <div class="py-2 px-3">
        {{ $wallets->links() }}
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script>
    $(window).on('load', function() {
        $('#messageModal').modal('show');
    });
</script>
@endpush