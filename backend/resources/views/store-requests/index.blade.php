@extends('layouts.app')

@section('title', 'Store Requests')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-0 overflow-hidden">
        <div class="d-flex justify-content-between" style="background-color: #C7CEEA;">
            <p class="h5 mb-0 p-3">List Store Requests</p>
            <div class="d-flex align-items-end px-3">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-tab-pane" type="button" role="tab" aria-controls="pending-tab-pane" aria-selected="true" style="color: #000000">pending</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="approved-tab" data-bs-toggle="tab" data-bs-target="#approved-tab-pane" type="button" role="tab" aria-controls="approved-tab-pane" aria-selected="false" style="color: #000000">approved</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="denied-tab" data-bs-toggle="tab" data-bs-target="#denied-tab-pane" type="button" role="tab" aria-controls="denied-tab-pane" aria-selected="false" style="color: #000000">denied</button>
                    </li>
                </ul>
            </div>

        </div>
        <div class="tab-content" id="myTabContent">
            @include('store-requests.tabs.approved')
            @include('store-requests.tabs.pending')
            @include('store-requests.tabs.denied')
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