<div class="tab-pane fade show active" id="pending-tab-pane" role="tabpanel" aria-labelledby="pending-tab" tabindex="0">
    @if(count($requests['pending']) <= 0) <div class="d-flex justify-content-between p-3">
        Không có đơn yêu cầu nào đang chờ duyệt
</div>
@else
@foreach($requests['pending'] as $index => $request)
<div class="{{ ($index == 0) ? 'py-2' : 'pb-2' }} px-3">
    <div class="d-flex justify-content-between rounded border">
        <div class="p-3">
            <p class="m-0">id tài khoản: {{$request->user->id}}</p>
            <p class="m-0"> mã giao dịch: {{$request->transaction_id}}</p>
            <p class="m-0">Tên: {{$request->name}} - {{$request->mssv}}</p>
            <p class="m-0">Số điện thoại: {{$request->phone}}</p>
            <p class="m-0">Email: {{ ($request->email) ?? 'null' }}</p>
            <p class="m-0">Lý do: {{ ($request->reason)}}</p>
            <p class="m-0">Thời gian gửi yêu cầu: {{$request->created_at}}</p>
            <p class="m-0" style="color: #FF9900">{{$request->status}}</p>
        </div>
        <div class="d-flex flex-column py-3 px-4">

            <button type="button" class="btn btn-theme w-full px-4 my-auto" data-bs-toggle="modal" data-bs-target="#approveModal">Chấp thuận</button>

            <div class="modal fade" id="approveModal" tabindex="-1" aria-labelledby="approveModalLabel" aria-hidden="true">

                <form action="{{route('organiser.credit-request.approve')}}" method="POST">
                    @csrf
                    <input type="hidden" name="request_id" value="{{ $request->id }}" required>
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <p>Hạn mức tín dụng:</p>
                                <input type="number" class="form-control" name="amount" required max="10000000" min="500000" oninvalid="alert('Số tiền nhập vào không được vượt quá 10.000.000 VND');">
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-theme px-4">Xác nhận</button>
                                <button type="button" class="btn btn-theme-cancel px-4" data-bs-dismiss="modal">Hủy</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <button type="button" class="btn btn-theme-warning w-full px-4 mb-auto" data-bs-toggle="modal" data-bs-target="#denyModal">Từ chối</button>

            <div class="modal fade" id="denyModal" tabindex="-1" aria-labelledby="denyModalLabel" aria-hidden="true">

                <form action="{{route('organiser.credit-request.deny')}}" method="POST">
                    @csrf
                    <input type="hidden" name="request_id" value="{{ $request->id }}" required>
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <p>Lí do từ chối:</p>
                                <textarea class="form-control" name="deny_reason" id="floatingTextarea"></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="submit" class="btn btn-theme-warning px-4">Từ chối</button>
                                <button type="button" class="btn btn-theme-cancel px-4" data-bs-dismiss="modal">Hủy</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </div>

</div>
@endforeach
@endif
</div>
