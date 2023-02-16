<div class="tab-pane fade" id="approved-tab-pane" role="tabpanel" aria-labelledby="approved-tab" tabindex="0">
    @if(count($requests['approved']) <= 0) <div class="d-flex justify-content-between p-3">
        Không có đơn yêu cầu đã chấp thuận nào
</div>
@else
@foreach($requests['approved'] as $index => $request)
<div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
    <div class="d-flex justify-content-between rounded border">
        <div class="p-3">
            <p class="m-0">id tài khoản: {{$request->user_id}}</p>
            <p class="m-0">Mã giao dịch: {{$request->transaction_id}}</p>
            <p class="m-0">Số điện thoại: {{$request->user->phone}}</p>
            <p class="m-0">Thời gian gửi yêu cầu: {{$request->created_at}}</p>
            <p class="m-0" style="color: #189F7F">Số tiền đã rút: {{number_format($request->amount)}} VND</p>
        </div>
    </div>
</div>
@endforeach
<div class="py-2 px-3">
    {{ $requests['approved']->links() }}
</div>
@endif
</div>
