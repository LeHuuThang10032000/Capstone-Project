<div class="tab-pane fade" id="denied-tab-pane" role="tabpanel" aria-labelledby="denied-tab" tabindex="0">
    @if(count($requests['denied']) <= 0) <div class="d-flex justify-content-between p-3">
        Không có đơn yêu cầu đã từ chối nào
</div>
@else
@foreach($requests['denied'] as $index => $request)
<div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3 ">
    <div class="d-flex justify-content-between rounded border">
        <div class="p-3">
            <b class="m-0">Mã giao dịch: {{$request->transaction_id}}</b>
            <p class="m-0">id tài khoản: {{$request->user_id}}</p>
            <p class="m-0">Số điện thoại: {{$request->user->phone}}</p>
            <p class="m-0">Thời gian gửi yêu cầu: {{$request->created_at}}</p>
            <p class="m-0" style="color: #E76969">Từ chối</p>
            <p class="m-0">Lý do từ chối: {{ ($request->deny_reason)}}</p>
        </div>
    </div>
</div>
@endforeach
<div class="py-2 px-3">
    {{ $requests['denied']->links() }}
</div>
@endif
</div>
