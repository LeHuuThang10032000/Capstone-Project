@extends('layouts.app')

@section('title', 'Accounts')

@section('content')

<div class="p-3">
    <div class="container-xxl bg-white rounded p-3">
        <div class="d-flex justify-content-between">
            <h3 class="mb-0">List Accounts</h3>
            <button class="btn btn-theme">Create new account</button>
        </div>
        
        <hr>
        <table class="table">
            <thead style="background-color: #C7CEEA">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">mssv</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

@endsection